export type QuestionItem = {
  question: string;
  options: string[];
  currentAnswer?: string;
};

export type QuestionWithCorrectAnswer = Omit<QuestionItem, "currentAnswer"> & {
  correctAnswer: string;
};

export type Questionnaire = {
  _id: string;
  title: string;
  questions: QuestionWithCorrectAnswer[];
  level: "Easy" | "Medium" | "Hard";
  tags: string[];
  createdAt: string;
  createdBy: string;
};
