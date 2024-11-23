import { Hono } from "hono";
import { cors } from "hono/cors";
import { GameAvailabilityStatus } from "hublock-shared";
import { Bindings } from "../bindings";
import {
  countTodayFinishedGames,
  getAvailableGame,
  getTodayOpeningGameCount,
  timeToNextOpeningGame,
} from "../service/game.service";
import { getDb } from "../util/db";
import { getIdFromHeader } from "../util/jwt";

export const gameRoute = new Hono<{ Bindings: Bindings }>();
gameRoute.use("/api/*", cors());

gameRoute.get("/api/timeToNextGame", async (c) => {
  const boardId = await getIdFromHeader(
    c.req.header("Authorization"),
    c.env.JWT_SECRET
  );

  if (!boardId) {
    return c.text("Unauthorized", 401);
  }

  const timeToNextGame = timeToNextOpeningGame();

  return c.json({ timeToNextGame });
});

gameRoute.get("/api/gameAvailableStatus", async (c) => {
  const boardId = await getIdFromHeader(
    c.req.header("Authorization"),
    c.env.JWT_SECRET
  );

  if (!boardId) {
    return c.text("Unauthorized", 401);
  }
  const todayOpeningGameCount = getTodayOpeningGameCount();

  const gameFinishedToday = await countTodayFinishedGames(
    getDb(c.env.DB),
    boardId
  );

  if (todayOpeningGameCount <= gameFinishedToday) {
    const response: GameAvailabilityStatus = {
      type: "unavailable",
      countdownTime: timeToNextOpeningGame(),
    };

    return c.json(response);
  } else {
    const game = await getAvailableGame(
      getDb(c.env.DB),
      c.env.LOBBY_DURABLE_OBJECT,
      boardId
    );
    const response: GameAvailabilityStatus = {
      type: "available",
      currentGameId: game.id,
      gameStatus: game.status,
    };

    return c.json(response);
  }
});

gameRoute.get("/lobby", async (c) => {
  const gameId = c.req.query("gameId");
  if (!gameId) {
    return c.json({ error: "Missing gameId", status: 400 });
  }
  const id = c.env.LOBBY_DURABLE_OBJECT.idFromName(gameId);
  const stub = c.env.LOBBY_DURABLE_OBJECT.get(id);

  return stub.fetch(c.req.raw);
});

gameRoute.post("/api/lobby/:gameId/ready", async (c) => {
  const userId = await getIdFromHeader(
    c.req.header("Authorization"),
    c.env.JWT_SECRET
  );
  if (!userId) {
    return c.json({ error: "Unauthorized", status: 401 });
  }
  const gameId = c.req.param("gameId");
  if (!gameId) {
    return c.json({ error: "Missing gameId", status: 400 });
  }
  const id = c.env.LOBBY_DURABLE_OBJECT.idFromName(gameId);
  const stub = c.env.LOBBY_DURABLE_OBJECT.get(id);

  const result = await stub.handleReady(userId);
  return c.json(result);
});

gameRoute.post("/api/lobby/:gameId/unready", async (c) => {
  const userId = await getIdFromHeader(
    c.req.header("Authorization"),
    c.env.JWT_SECRET
  );
  if (!userId) {
    return c.json({ error: "Unauthorized", status: 401 });
  }
  const gameId = c.req.param("gameId");
  if (!gameId) {
    return c.json({ error: "Missing gameId", status: 400 });
  }
  const id = c.env.LOBBY_DURABLE_OBJECT.idFromName(gameId);
  const stub = c.env.LOBBY_DURABLE_OBJECT.get(id);

  const result = await stub.handleDisconnect(userId);
  return c.json(result);
});

gameRoute.post("/api/lobby/:gameId/reset", async (c) => {
  const gameId = c.req.param("gameId");
  if (!gameId) {
    return c.json({ error: "Missing gameId", status: 400 });
  }
  const id = c.env.LOBBY_DURABLE_OBJECT.idFromName(gameId);
  const stub = c.env.LOBBY_DURABLE_OBJECT.get(id);

  const result = await stub.reset();
  return c.json(result);
});
