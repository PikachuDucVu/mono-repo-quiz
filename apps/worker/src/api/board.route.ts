import { Hono } from "hono";
import { cors } from "hono/cors";
import { Bindings } from "../bindings";
import { boardExists } from "../service/board.service";
import { getDb } from "../util/db";
import { signJwt } from "../util/jwt";
import { setupAdminAuth } from "../util/setup";

export const boardRoute = new Hono<{ Bindings: Bindings }>();
boardRoute.use("/api/*", cors());

boardRoute.get("/api/status", (c) => {
  const authorizationHeader = c.req.header("Authorization");
  if (!authorizationHeader) {
    return c.text("Unauthorized", 401);
  }
  const token = authorizationHeader.split(" ")[1];
  return c.text("Hello, board!");
});

boardRoute.post("/api/setup-status", async (c) => {
  const body = await c.req.json();

  if (!body.id) {
    return c.text("Missing id", 400);
  }
  const id = body.id;

  if (await boardExists(getDb(c.env.DB), id)) {
    return c.json({ exists: true });
  }
  return c.json({ exists: false });
});

boardRoute.post("/api/setup-token", async (c) => {
  const body = await c.req.json();

  if (!body.id) {
    return c.text("Missing id", 400);
  }

  const token = signJwt({ id: body.id }, c.env.JWT_SECRET);
  return c.json({ token });
});

boardRoute.post("/api/setup", setupAdminAuth, async (c) => {
  const body = await c.req.json();

  if (!body.id) {
    return c.text("Missing id", 400);
  }

  if (await boardExists(getDb(c.env.DB), body.id)) {
    return c.text("Board already exists", 400);
  }

  // TODO: save metadata of board

  const id = c.env.SETUP_DURABLE_OBJECT.idFromName("global");
  const stub = c.env.SETUP_DURABLE_OBJECT.get(id);
  const result = await stub.setup(body.id);
  if (result) {
    return c.text("Setup successfully", 200);
  }
  return c.text("Setup failed", 500);
});

boardRoute.get("/setup", (c) => {
  const upgradeHeader = c.req.header("Upgrade");
  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Durable Object expected Upgrade: websocket", {
      status: 426,
    });
  }
  const id = c.env.SETUP_DURABLE_OBJECT.idFromName("global");
  const stub = c.env.SETUP_DURABLE_OBJECT.get(id);

  return stub.fetch(c.req.raw);
});
