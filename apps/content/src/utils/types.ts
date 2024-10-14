export type QuestionItem = {
  question: string;
  options: string[];
  userAnswer?: string;
};

export type Questions = Omit<QuestionItem, "userAnswer"> & {
  correctAnswer: string;
};

export type Questionnaire = {
  _id?: string;
  title: string;
  totalQuestions: number;
  level: "Easy" | "Medium" | "Hard";
  tags: string[];
  historyParticipants?: {
    uid: string;
    username: string;
    email: string;
    score: number;
  }[];
  status: "active" | "inactive";
  createdAt?: string;
  createdBy?: {
    uid: string;
    username: string;
    _id: string;
  };
};

type HistoricalQuiz = {
  questionaireId: string;
  questionaireName: string;
  answersData: QuestionItem[];
  score: number;
};

type UserData = {
  imgUrl: string;
  history: HistoricalQuiz[];
};

export type User = {
  username: string;
  email: string;
  password: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "banned";
  userData: UserData;
  createdAt: Date;
  updatedAt: Date;
};
