import mongoose from "mongoose";
import {
  IQuestionnaire,
  QuestionnaireSchema,
} from "./schemas/QuestionnaireSchema";
import { Hono } from "hono";
import { connectMongoose } from "./services/mongoose";

const QuestionnaireAPI = async (app: Hono, currentServerTime: string) => {
  connectMongoose();

  app.post("/addQuestionaire", async (c) => {
    const body = (await c.req.json()) as IQuestionnaire;

    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);

    if (!body.title || !body.questions) {
      return c.text("Missing information", 400);
    }
    if (!body.questions.length) {
      return c.text("Questionaire must have at least one question", 400);
    }

    for (const question of body.questions) {
      if (!question.question) {
        return c.text("Some question is missing question", 400);
      }
      if (!question.options.length) {
        return c.text("Some question is missing options", 400);
      }
      if (!question.correctAnswer) {
        return c.text("Some question is missing correct answer", 400);
      }
    }

    const questionaire = {
      title: body.title,
      questions: body.questions,
      createdBy: new mongoose.Types.ObjectId(),
    };
    await Questionnaire.create(questionaire);

    console.log("POST /addQuestionaire", body.title, new Date());
    return c.text("Create questionaire successfully!", 201);
  });

  app.get("/getQuestionaire", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const questionaires = await Questionnaire.find();
    console.log("GET /getQuestionaire", new Date());
    return c.json(questionaires);
  });

  app.get("/getQuestionaire/:id", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const id = c.req.param("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.text("Invalid id", 400);
    }

    const questionaire = await Questionnaire.findById(id);
    console.log("GET /getQuestionaire/", id, new Date());

    if (!questionaire) {
      return c.text("Questionaire not found", 404);
    }
    return c.json(questionaire);
  });

  app.delete("/deleteQuestionaire/:id", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const id = c.req.param("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.text("Invalid id", 400);
    }

    const questionaire = await Questionnaire.findByIdAndDelete(id);
    console.log("DELETE /deleteQuestionaire/", id, new Date());

    if (!questionaire) {
      return c.text("Questionaire not found", 404);
    }
    return c.text("Delete questionaire successfully!", 200);
  });

  app.put("/updateQuestionaire/:id", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const id = c.req.param("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.text("Invalid id", 400);
    }

    const body = (await c.req.json()) as IQuestionnaire;

    if (!body.title || !body.questions) {
      return c.text("Missing information", 400);
    }
    if (!body.questions.length) {
      return c.text("Questionaire must have at least one question", 400);
    }

    for (const question of body.questions) {
      if (!question.question) {
        return c.text("Some question is missing question", 400);
      }
      if (!question.options.length) {
        return c.text("Some question is missing options", 400);
      }
      if (!question.correctAnswer) {
        return c.text("Some question is missing correct answer", 400);
      }
    }

    const questionaire = {
      title: body.title,
      questions: body.questions,
      createdBy: new mongoose.Types.ObjectId(),
    };
    await Questionnaire.findByIdAndUpdate(id, questionaire);

    console.log("PUT /updateQuestionaire/", id, new Date());
    return c.text("Update questionaire successfully!", 200);
  });
};

export default QuestionnaireAPI;
