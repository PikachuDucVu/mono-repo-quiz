import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

export type HublockDatabaseTables = {
  board: {
    id: string;
    createdAt: number;
  };
  game: {
    id: string;
    status: "open" | "playing" | "finished";
    boardId: string;
    playerList: string;
    createdAt: number;
  };
  user: {
    id: string;
    displayName: string;
    createdAt: number;
  };
};

export type HublockDatabase = Kysely<HublockDatabaseTables>;

export const getDb = (db: D1Database) => {
  return new Kysely<HublockDatabaseTables>({
    dialect: new D1Dialect({
      database: db,
    }),
  });
};
