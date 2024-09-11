import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  IQuestionnaire,
  QuestionnaireSchema,
} from "../../schemas/QuestionnaireSchema";
import { Hono } from "hono";
import { connectMongoose } from "../mongoose";
import { ClientAnswer } from "../../schemas/QuestionSchema";
import { bearerAuth } from "hono/bearer-auth";
import { getCookie } from "hono/cookie";
import UserSchema from "../../schemas/UserSchema";

const QuestionnaireAPI = async (app: Hono, currentServerTime: string) => {
  connectMongoose();
  app.use(
    "/user/*",
    bearerAuth({
      verifyToken: async (token, c) => {
        return token === getCookie(c, "token");
      },
    })
  );

  app.post("user/addQuestionaire", async (c) => {
    const body = (await c.req.json()) as IQuestionnaire;
    const token = getCookie(c, "token");
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);

    if (!body.title || !body.questions) {
      return c.text("Missing information", 400);
    }
    if (!body.questions.length) {
      return c.text("Questionaire must have at least one question", 400);
    }

    for (const question of body.questions) {
      if (!question.question) {
        return c.text("Some question is missing text", 400);
      }
      if (!question.options.length) {
        return c.text("Some question is missing options", 400);
      }
      if (!question.correctAnswer) {
        return c.text("Some question is missing correct answer", 400);
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET.toString()) as {
      email: string;
      username: string;
    };

    if (!decoded.email) {
      return c.text("Invalid token", 400);
    }

    const User = mongoose.model("User", UserSchema);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return c.text("User not found", 404);
    }
    const userObjectID = user._id;

    const questionaire = {
      title: body.title,
      questions: body.questions,
      tags: body.tags,
      level: body.level,
      createdBy: {
        uid: userObjectID,
        username: user.username,
      },
    };
    await Questionnaire.create(questionaire);

    return c.text("Create questionaire successfully!", 201);
  });

  app.get("/getQuestionaire", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const questionaires = await Questionnaire.find();
    return c.json(questionaires);
  });

  app.get("user/getQuestionaireToEdit/:id", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const id = c.req.param("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.text("Invalid id", 400);
    }

    const questionaire = await Questionnaire.findById(id);

    if (!questionaire) {
      return c.text("Questionaire not found", 404);
    }
    return c.json(questionaire);
  });

  app.get("user/examQuestionaire/:id", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const id = c.req.param("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.text("Invalid id", 400);
    }

    const questionaire = await Questionnaire.findById(id);

    if (!questionaire) {
      return c.text("Not found", 404);
    }
    const filteredQuestionaire = questionaire.questions.map((question) => {
      return {
        question: question.question,
        options: question.options,
      };
    });
    return c.json(filteredQuestionaire);
  });

  app.post("user/submitAnswer/:id", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const id = c.req.param("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.text("Invalid id", 400);
    }

    const body = (await c.req.json()) as ClientAnswer[];
    const questionaire = await Questionnaire.findById(id);
    const token = getCookie(c, "token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET.toString()) as {
      email: string;
      username: string;
    };

    if (!decoded.email) {
      return c.text("Invalid token", 400);
    }

    const User = mongoose.model("User", UserSchema);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return c.text("User not found", 404);
    }

    if (!questionaire) {
      return c.text("Not found", 404);
    }

    let score = 0;
    for (let i = 0; i < body.length; i++) {
      if (body[i].question !== questionaire.questions[i].question) {
        return c.text("Invalid question", 400);
      }
      if (body[i].options.length !== questionaire.questions[i].options.length) {
        return c.text("Invalid options", 400);
      }

      if (body[i].userAnswer === questionaire.questions[i].correctAnswer) {
        score++;
      }
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          history: {
            questionaireId: new mongoose.Types.ObjectId(id),
            questionaireName: questionaire.title,
            answersData: body,
            score,
          },
        },
      },
      { new: true }
    );

    return c.json({ score });
  });

  app.delete("user/deleteQuestionaire/:id", async (c) => {
    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const id = c.req.param("id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.text("Invalid id", 400);
    }

    const questionaire = await Questionnaire.findByIdAndDelete(id);

    if (!questionaire) {
      return c.text("Questionaire not found", 404);
    }
    return c.text("Delete questionaire successfully!", 200);
  });

  app.put("user/updateQuestionaire/:id", async (c) => {
    const token = getCookie(c, "token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET.toString()) as {
      email: string;
      username: string;
    };

    if (!decoded.email) {
      return c.text("Invalid token", 400);
    }
    const User = mongoose.model("User", UserSchema);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return c.text("User not found", 404);
    }
    const userObjectID = user._id;

    const Questionnaire = mongoose.model("Questionnaire", QuestionnaireSchema);
    const QuestionaireId = c.req.param("id");

    const existQuestionaire = await Questionnaire.findById(QuestionaireId);
    if (!existQuestionaire) {
      return c.text("Questionaire not found", 404);
    }

    if (!user.isAdmin) {
      if (
        existQuestionaire.createdBy.uid.toString() !== userObjectID.toString()
      ) {
        return c.text(
          "You are not authorized to update this questionaire",
          401
        );
      }
    }

    const body = (await c.req.json()) as IQuestionnaire;

    if (!body.title || !body.questions || !body.level) {
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

    await Questionnaire.findByIdAndUpdate(QuestionaireId, {
      title: body.title,
      questions: body.questions,
      tags: body.tags.length ? body.tags : [],
      level: body.level,
    });

    return c.text("Update questionaire successfully!", 200);
  });
};

export default QuestionnaireAPI;
