import { HublockDatabase } from "../util/db";

export const saveBoard = async (db: HublockDatabase, id: string) => {
  return await db
    .insertInto("board")
    .values({ id, createdAt: Date.now() })
    .execute();
};

export const boardExists = async (db: HublockDatabase, id: string) => {
  const board = await db
    .selectFrom("board")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  return !!board;
};

export const getBoard = async (db: HublockDatabase, id: string) => {
  const board = await db
    .selectFrom("board")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  return board;
};
