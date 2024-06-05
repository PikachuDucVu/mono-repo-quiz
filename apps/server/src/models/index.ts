import mongoose from "mongoose";
import { QuestionnaireSchema } from "../schemas/QuestionnaireSchema";

const MONGO_URI = "mongodb://127.0.0.1:27017/quiz-app";

const db = await mongoose.connect(MONGO_URI);
console.log("Connected to:", db.connection.name);
const Questionnaire = mongoose.model("questionaires", QuestionnaireSchema);

const addQuestionaire = async () => {
  const questionaire = {
    title: "My Questionaire",
    questions: [
      {
        question: "What is 1+1?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
      },
      {
        question: "What is 2+2?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "4",
      },
    ],
    createdBy: new mongoose.Types.ObjectId(),
  };
  return Questionnaire.create(questionaire);
};

// await addQuestionaire();
console.log("Questionaire:", await Questionnaire.find({}));
