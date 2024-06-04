export type Question = {
  question: string;
  options: string[];
  currentAnswer?: string;
};

export type QuizDefinition = Omit<Question, "currentAnswer"> & {
  correctAnswer: string;
};
