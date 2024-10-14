import { ClientAnswer } from "./QuestionSchema";
import { Schema } from "mongoose";
import {
  HistoricalQuiz,
  HistoryQuestionaireSchema,
} from "./HistoryQuestionaireSchema";

type UserData = {
  imgUrl: string;
  history: HistoricalQuiz[];
};

type User = {
  avatarImageUrl: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "banned";
  userData?: UserData;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<User>({
  username: { type: String, required: true, index: true },
  email: { type: String, required: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "moderator", "admin"], default: "user" },
  status: {
    type: String,
    enum: ["active", "banned"],
    default: "active",
  },
  userData: {
    type: {
      imgUrl: { type: String, default: "" },
      history: {
        type: [
          {
            questionaireId: Schema.Types.ObjectId,
            questionaireName: String,
            answersData: {
              type: {
                question: { type: String, required: true },
                userAnswer: { type: String, required: true },
                options: { type: [String], required: true },
              },
            },
            score: Number,
          },
        ],
        default: [],
      },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default UserSchema;
