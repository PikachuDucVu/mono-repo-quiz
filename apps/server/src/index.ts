import { Hono } from "hono";
import { cors } from "hono/cors";
import QuestionnaireAPI from "./services/apis/QuestionnaireAPI";
import { logger } from "hono/logger";
import AuthenticationAPI from "./services/apis/UserAPI";
import AdminAPI from "./services/apis/AdminAPI";
import { connectMongoose } from "./services/mongoose";
import {
  DownloadFile,
  GetAllFilesSPCK,
  UploadFile,
  UploadImage,
} from "./services/apis/UploadFileS3API";
import { CustomAPI } from "./services/apis/hieu-services/CustomAPI";

const app = new Hono();
// app.use(
//   "*",
//   cors({
//     origin: [
//       process.env.VITE_STORAGE_CLIENT_URL,
//       process.env.VITE_CLIENT_QUIZ_URL,
//       process.env.VITE_ADMIN_QUIZ_URL,
//     ],
//     credentials: true,
//   })
// );

app.use(
  "*",
  cors({
    origin: "*",
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
CustomAPI(app, currentServerTime);
// s3aws
UploadImage(app);
UploadFile(app);
GetAllFilesSPCK(app);
DownloadFile(app);

export { app, currentServerTime };
export default app;
