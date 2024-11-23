import { v4 as uuid } from "uuid";
import { LobbyDO } from "../do/LobbyDO";
import { HublockDatabase } from "../util/db";

type OpeningGameRule = {
  hours: number;
  minutes: number;
  count: number;
};

export const openingGameRules: OpeningGameRule[] = [
  {
    hours: 0,
    minutes: 0,
    count: 10,
  },
  {
    hours: 1,
    minutes: 30,
    count: 3,
  },
  {
     
    hours: 22,
    minutes: 36,
    count: 100,
  },
].sort((a, b) => a.hours - b.hours);

const LOCAL_TIMEZONE_OFFSET_BY_HOUR = -7; // UTC+7: Bangkok-Hanoi-Jakarta

export const getCurentDateBySpecificTimezoneOffset = (
  offsetInHours: number
) => {
  const now = new Date();
  const currentOffset = now.getTimezoneOffset();
  const expectedOffset = offsetInHours * 60;

  now.setMinutes(now.getMinutes() + expectedOffset - currentOffset);
  return now;
};

export const getCurrentTimeBySpecificTimezoneOffset = (
  offsetInHours: number
) => {
  const now = getCurentDateBySpecificTimezoneOffset(offsetInHours);
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };
};

export const getTodayOpeningGameCount = () => {
  const currentTime = getCurrentTimeBySpecificTimezoneOffset(
    LOCAL_TIMEZONE_OFFSET_BY_HOUR
  );
  let totalCount = 0;
  for (const rule of openingGameRules) {
    if (
      currentTime.hours * 60 + currentTime.minutes >
      rule.hours * 60 + rule.minutes
    ) {
      totalCount += rule.count;
    }
  }
  return totalCount;
};

export const getBeginningOfToday = () => {
  const currentTime = getCurentDateBySpecificTimezoneOffset(
    LOCAL_TIMEZONE_OFFSET_BY_HOUR
  );
  return new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate()
  );
};

export const timeToNextOpeningGame = () => {
  const currentTime = getCurentDateBySpecificTimezoneOffset(
    LOCAL_TIMEZONE_OFFSET_BY_HOUR
  );
  let nextRule: OpeningGameRule | undefined;
  for (const rule of openingGameRules) {
    if (
      currentTime.getHours() * 60 + currentTime.getMinutes() <
      rule.hours * 60 + rule.minutes
    ) {
      nextRule = rule;
      break;
    }
  }
  if (!nextRule) {
    nextRule = openingGameRules[0];
  }
  const ruleDate = new Date(currentTime);
  ruleDate.setHours(nextRule.hours);
  ruleDate.setMinutes(nextRule.minutes);
  ruleDate.setSeconds(0);
  ruleDate.setMilliseconds(0);
  let timeToNextOpeningGame = ruleDate.getTime() - currentTime.getTime();
  while (timeToNextOpeningGame < 0) {
    timeToNextOpeningGame += 24 * 60 * 60 * 1000;
  }
  return timeToNextOpeningGame;
};

export const finishGame = async (
  db: HublockDatabase,
  id: string,
  boardId: string
) => {
  return await db
    .insertInto("game")
    .values({
      id,
      createdAt: Date.now(),
      status: "finished",
      boardId,
      playerList: JSON.stringify([]),
    })
    .execute();
};

export const countTodayFinishedGames = async (
  db: HublockDatabase,
  boardId: string
) => {
  const games = await db
    .selectFrom("game")
    .selectAll()
    .where("status", "=", "finished")
    .where("boardId", "=", boardId)
    .where("createdAt", ">=", getBeginningOfToday().getTime())
    .execute();
  return games.length;
};

export const getAllGame = async (db: HublockDatabase) => {
  const games = await db.selectFrom("game").selectAll().execute();

  return games;
};

export const getAvailableGame = async (
  db: HublockDatabase,
  LOBBY_DURABLE_OBJECT: DurableObjectNamespace<LobbyDO>,
  boardId: string
): Promise<{
  id: string;
  status: "open" | "playing" | "finished";
}> => {
  const game = await db
    .selectFrom("game")
    .selectAll()
    .where("status", "!=", "finished")
    .where("boardId", "=", boardId)
    .executeTakeFirst();

  if (game) {
    return { id: game.id, status: game.status };
  }

  const id = uuid();
  const objectId = LOBBY_DURABLE_OBJECT.idFromName(id);
  const stub = LOBBY_DURABLE_OBJECT.get(objectId);
  await stub.init(id);

  await db
    .insertInto("game")
    .values({
      id,
      createdAt: Date.now(),
      status: "open",
      boardId,
      playerList: JSON.stringify([]),
    })
    .execute();
  return {
    id,
    status: "open",
  };
};

export const addPlayerToGame = async (
  storage: DurableObjectStorage,
  playerId: string
) => {
  const playerList = (await storage.get("playerIds")) as string[] | undefined;
  if (!playerList) {
    await storage.put("playerIds", [playerId]);
    return [playerId];
  }

  if (!playerList.includes(playerId)) {
    playerList.push(playerId);
    await storage.put("playerIds", playerList);
  }
  return playerList;
};

export const removePlayerFromGame = async (
  storage: DurableObjectStorage,
  playerId: string
) => {
  const playerList = (await storage.get("playerIds")) as string[] | undefined;
  if (!playerList) {
    return [];
  }

  if (playerList.includes(playerId)) {
    playerList.splice(playerList.indexOf(playerId), 1);
    await storage.put("playerIds", playerList);
  }
  return playerList;
};

export const markGameAsPlaying = async (
  db: HublockDatabase,
  gameId: string,
  playerIds: string[]
) => {
  await db
    .updateTable("game")
    .set("playerList", JSON.stringify(playerIds))
    .set("status", "playing")
    .where("id", "=", gameId)
    .execute();
};

export const getPlayersByIds = async (
  db: HublockDatabase,
  playerIds: string[]
) => {
  const players = await db
    .selectFrom("user")
    .selectAll()
    .where("id", "in", playerIds)
    .execute();

  return players;
};

export const getPlayerInfosFromDb = async (
  db: HublockDatabase,
  gameId: string
) => {
  const game = await db
    .selectFrom("game")
    .selectAll()
    .where("id", "=", gameId)
    .executeTakeFirst();

  if (!game) {
    return [];
  }

  const playerIds = JSON.parse(game.playerList);
  return await getPlayersByIds(db, playerIds);
};

export const updateGameStatus = async (
  db: HublockDatabase,
  gameId: string,
  status: "open" | "playing" | "finished"
) => {
  await db
    .updateTable("game")
    .set("status", status)
    .where("id", "=", gameId)
    .execute();
};
