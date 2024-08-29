export type QuestionItem = {
  question: string;
  options: string[];
  userAnswer?: string;
};

export type QuestionWithCorrectAnswer = Omit<QuestionItem, "userAnswer"> & {
  correctAnswer: string;
};

export type Questionnaire = {
  _id?: string;
  title: string;
  questions: QuestionWithCorrectAnswer[];
  level: "Easy" | "Medium" | "Hard";
  tags: string[];
  createdAt?: string;
  createdBy?: {
    uid: string;
    username: string;
    _id: string;
  };
};

export type User = {
  username: string;
  email: string;
  isAdmin?: boolean;
};
