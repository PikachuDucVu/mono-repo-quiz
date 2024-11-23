import { Hono } from "hono";
import { cors } from "hono/cors";
import { Bindings } from "../bindings";
import { getIdFromHeader } from "../util/jwt";

export const gameplayRoute = new Hono<{ Bindings: Bindings }>();
gameplayRoute.use("/api/*", cors());

gameplayRoute.post("/api/:gameId/reset", async (c) => {
  const gameId = c.req.param("gameId");
  if (!gameId) {
    return c.json({ error: "Missing gameId", status: 400 });
  }
  const id = c.env.GAME_DURABLE_OBJECT.idFromName(gameId);
  const stub = c.env.GAME_DURABLE_OBJECT.get(id);

  await stub.start(gameId, true);
  return c.text("Game reset successfully", 200);
});

gameplayRoute.post("/api/:gameId/answer", async (c) => {
  const playerId = await getIdFromHeader(
    c.req.header("Authorization"),
    c.env.JWT_SECRET
  );
  if (!playerId) {
    return c.json({ error: "Unauthorized", status: 401 });
  }
  const gameId = c.req.param("gameId");
  if (!gameId) {
    return c.json({ error: "Missing gameId", status: 400 });
  }
  const id = c.env.GAME_DURABLE_OBJECT.idFromName(gameId);
  const stub = c.env.GAME_DURABLE_OBJECT.get(id);

  const body = await c.req.json();
  if (!body.answer) {
    body.answer = "";
  }

  await stub.handlePlayerAnswer(playerId, body.answer);
  return c.text("Answer submitted successfully", 200);
});

gameplayRoute.get("/play/:gameId", async (c) => {
  const gameId = c.req.param("gameId");
  if (!gameId) {
    return c.json({ error: "Missing gameId", status: 400 });
  }
  const id = c.env.GAME_DURABLE_OBJECT.idFromName(gameId);
  const stub = c.env.GAME_DURABLE_OBJECT.get(id);

  return stub.fetch(c.req.raw);
});

gameplayRoute.post("/api/openBox", async (c) => {
  const { gameId } = await c.req.json();

  if (!gameId) {
    return c.text("Missing gameId", 400);
  }

  const id = c.env.GAME_DURABLE_OBJECT.idFromName(gameId);
  const stub = c.env.GAME_DURABLE_OBJECT.get(id);

  await stub.handleOpenBox();
  return c.text("Box opened successfully", 200);
});
