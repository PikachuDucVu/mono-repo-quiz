import { Schema, Types } from "mongoose";
import QuestionSchema, { IQuestion } from "./QuestionSchema";

export type IQuestionnaire = {
  title: string;
  questions: IQuestion[];
  createdAt: Date;
  createdBy: Types.ObjectId;
};

export const QuestionnaireSchema = new Schema<IQuestionnaire>({
  title: { type: String, required: true, index: true },
  questions: { type: [QuestionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, required: true, index: true },
});
