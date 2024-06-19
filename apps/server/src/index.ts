import { Hono } from "hono";
import { cors } from "hono/cors";
import { CustomAPI } from "./services/apis/CustomAPI";
import QuestionnaireAPI from "./services/apis/QuestionnaireAPI";
import { logger } from "hono/logger";
import AuthenticationAPI from "./services/apis/AuthenticationAPI";

const app = new Hono();
app.use(cors());
app.use(logger());

const currentServerTime = new Date().toISOString();

app.get("/", (c) => {
  console.log("GET /", new Date());
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

app.get("/testLoop/:times", (c) => {
  const times = parseInt(c.req.param("times"));

  const startTime = Date.now();

  let result = "";
  for (let i = 0; i < times; i++) {
    result += `${i} `;
  }

  const endTime = Date.now();
  console.log("Execution Time", (endTime - startTime) / 1000, "s");

  return c.json({ executionTime: (endTime - startTime) / 1000 });
});

app.notFound((c) => {
  return c.text("Khong tim thay, 404 Not found", 404);
});

QuestionnaireAPI(app, currentServerTime);
AuthenticationAPI(app, currentServerTime);
CustomAPI(app, currentServerTime);

export { app, currentServerTime };
export default app;
