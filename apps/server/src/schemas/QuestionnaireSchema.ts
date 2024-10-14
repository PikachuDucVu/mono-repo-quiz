import { Schema, Types } from "mongoose";
import QuestionSchema, { ClientAnswer, IQuestion } from "./QuestionSchema";
import { HistoricalQuiz } from "./HistoryQuestionaireSchema";

export type IQuestionnaire = {
  title: string;
  questions: IQuestion[];
  level: "Easy" | "Medium" | "Hard";
  tags: string[];
  historyParticipants: HistoricalQuiz &
    {
      uid: Types.ObjectId;
      username: string;
      email: string;
      score: number;
      answersData: ClientAnswer[];
    }[];
  status: "active" | "inactive";
  createdAt: Date;
  createdBy: {
    uid: Types.ObjectId;
    username: string;
  };
};

export const QuestionnaireSchema = new Schema<IQuestionnaire>({
  title: { type: String, required: true, index: true },
  questions: { type: [QuestionSchema], required: true },
  level: { type: String, required: true },
  tags: { type: [String], default: [] },
  historyParticipants: {
    type: [
      {
        uid: Schema.Types.ObjectId,
        username: String,
        email: String,
        score: Number,
        answersData: {
          type: [
            {
              question: String,
              options: [String],
              userAnswer: String,
            },
          ],
        },
      },
    ],
    default: [],
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: {
      uid: Schema.Types.ObjectId,
      username: String,
    },
    required: true,
    index: true,
  },
});
