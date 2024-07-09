import { Hono } from "hono";
import { cors } from "hono/cors";
import QuestionnaireAPI from "./services/apis/QuestionnaireAPI";
import { logger } from "hono/logger";
import AuthenticationAPI from "./services/apis/AuthenticationAPI";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://quiz.ducvu.name.vn"],
    credentials: true,
  })
);
app.use(logger());

const currentServerTime = new Date().toISOString();

app.get("/", (c) => {
  return c.json({
    name: "DucVuAPIServer",
    version: "2.0.0",
    startServerTime: currentServerTime,
  });
});

app.notFound((c) => {
  return c.text("Khong tim thay, 404 Not found", 404);
});

QuestionnaireAPI(app, currentServerTime);
AuthenticationAPI(app, currentServerTime);

export { app, currentServerTime };
export default app;
