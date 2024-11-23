import { Hono } from "hono";
import { cors } from "hono/cors";
import { Bindings } from "../bindings";
import { getIdFromHeader, signJwt } from "../util/jwt";
import { v4 as uuid } from "uuid";
import { getDb } from "../util/db";

export const playerRoute = new Hono<{ Bindings: Bindings }>();

playerRoute.use("/api/*", cors());
playerRoute.post("/api/register", async (c) => {
  const body = await c.req.json();
  const id = uuid();

  const name = body.name;
  if (!name) {
    return c.json({ error: "name is required" }, 400);
  }

  await getDb(c.env.DB)
    .insertInto("user")
    .values({ id, displayName: name, createdAt: Date.now() })
    .execute();

  const token = await signJwt({ id, role: "player" }, c.env.JWT_SECRET);
  return c.json({ token });
});
playerRoute.get("/api/me", async (c) => {
  const id = await getIdFromHeader(
    c.req.header("Authorization"),
    c.env.JWT_SECRET
  );

  if (!id) {
    return c.json({ error: "Unauthorized", status: 401 });
  }

  const info = await getDb(c.env.DB)
    .selectFrom("user")
    .select(["id", "displayName"])
    .where("id", "=", id)
    .executeTakeFirst();

  if (!info) {
    return c.json({ error: "User not found", status: 404 });
  }

  return c.json(info);
});
