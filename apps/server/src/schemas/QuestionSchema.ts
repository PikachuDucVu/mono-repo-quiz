import { Schema, Types } from "mongoose";

export type IQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

export type ClientAnswer = Omit<IQuestion, "correctAnswer"> & {
  userAnswer: string;
};

export default QuestionSchema;
