import { Hono } from "hono";
import { cors } from "hono/cors";
import QuestionnaireAPI from "./QuestionnaireAPI";

const app = new Hono();
app.use(cors());
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

app.notFound((c) => {
  return c.text("Khong tim thay, 404 Not found", 404);
});

QuestionnaireAPI(app, currentServerTime);

export { app, currentServerTime };
export default app;
