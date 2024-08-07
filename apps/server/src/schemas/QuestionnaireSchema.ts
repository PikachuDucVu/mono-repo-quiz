import { Schema, Types } from "mongoose";
import QuestionSchema, { IQuestion } from "./QuestionSchema";

export type IQuestionnaire = {
  title: string;
  questions: IQuestion[];
  level: "Easy" | "Medium" | "Hard";
  tags: string[];
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
  tags: { type: [String], required: true },
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
