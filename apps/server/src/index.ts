import { Hono } from "hono";

const app = new Hono();
const currentServerTime = new Date().toISOString();

app.get("/", (c) => {
  //return server info
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
