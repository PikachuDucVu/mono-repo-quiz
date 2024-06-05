import { Hono } from "hono";
import { connectMongoose } from "./services/mongoose";
import mongoose from "mongoose";
import {
  IQuestionnaire,
  QuestionnaireSchema,
} from "./schemas/QuestionnaireSchema";

const app = new Hono();
const currentServerTime = new Date().toISOString();
connectMongoose();

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

app.post("/addQuestionaire", async (c) => {
  const body = (await c.req.json()) as IQuestionnaire;

  const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);

  if (body.title === undefined || body.questions === undefined) {
    return c.text(`Missing infomation`, 400);
  }
  if (!body.questions.length) {
    return c.text(`Questionaire must have at least one question`, 400);
  }
  body.questions.map((question) => {
    if (!question.question) {
      return c.text(`Some question is missing question`, 400);
    }
    if (!question.options.length) {
      return c.text(`Some question is missing options`, 400);
    }
    if (!question.correctAnswer) {
      return c.text(`Some question is missing correct answer`, 400);
    }
  });

  const questionaire = {
    title: body.title,
    questions: body.questions,
    createdBy: new mongoose.Types.ObjectId(),
  };
  Questionnaire.create(questionaire);

  console.log("POST /addQuestionaire", body.title, new Date());
  return c.text(`Create questionaire successfully!`, 201);
});

app.get("/getQuestionaire", async (c) => {
  const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
  const questionaires = await Questionnaire.find();
  console.log("GET /getQuestionaire", new Date());
  return c.json(questionaires);
});

export default app;
