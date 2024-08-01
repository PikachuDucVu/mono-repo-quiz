import { Schema } from "mongoose";
import {
  HistoricalQuiz,
  HistoryQuestionaireSchema,
} from "./HistoryQuestionaireSchema";

type User = {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  history: HistoricalQuiz[];
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<User>({
  username: { type: String, required: true, index: true },
  email: { type: String, required: true, index: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  history: {
    type: [HistoryQuestionaireSchema],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default UserSchema;
