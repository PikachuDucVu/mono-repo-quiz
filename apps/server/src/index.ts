import { Hono } from "hono";
import { connectMongoose } from "./services/mongoose";

const app = new Hono();
const currentServerTime = new Date().toISOString();
// connectMongoose();

app.get("/", (c) => {
  console.log("GET /");
  return c.json({
    name: "DucVuAPIServer",
    version: "1.0.0",
    startServerTime: currentServerTime,
  });
});

app.get("/hello/:name", (c) => {
  const name = c.req.param("name");
  return c.text(`Hello ${name}!`);
});

export default app;
