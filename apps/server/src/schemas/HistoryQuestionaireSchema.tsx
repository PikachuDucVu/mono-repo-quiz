import { Schema } from "mongoose";
import { ClientAnswer } from "./QuestionSchema";

export type HistoricalQuiz = {
  questionaireId: Schema.Types.ObjectId;
  questionaireName: string;
  answersData: ClientAnswer[];
  score: number;
  createdAt: Date;
};

export const HistoryQuestionaireSchema = new Schema<HistoricalQuiz>({
  questionaireId: { type: Schema.Types.ObjectId, required: true },
  questionaireName: { type: String, required: true },
  answersData: {
    type: [
      {
        question: { type: String, required: true },
        userAnswer: { type: String, required: true },
        options: { type: [String], required: true },
      },
    ],
    required: true,
  },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
