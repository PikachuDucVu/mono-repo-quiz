import { UploadImage } from "./services/apis/ImageS3API";
import { Hono } from "hono";
import { cors } from "hono/cors";
import QuestionnaireAPI from "./services/apis/QuestionnaireAPI";
import { logger } from "hono/logger";
import AuthenticationAPI from "./services/apis/UserAPI";
import AdminAPI from "./services/apis/AdminAPI";
import { connectMongoose } from "./services/mongoose";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: [process.env.URL_ADMIN_APP, process.env.URL_CLIENT_APP],
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

connectMongoose();

AdminAPI(app);
AuthenticationAPI(app, currentServerTime);
QuestionnaireAPI(app, currentServerTime);
UploadImage(app);

export { app, currentServerTime };
export default app;
