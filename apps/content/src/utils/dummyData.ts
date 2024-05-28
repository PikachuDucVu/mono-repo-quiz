export type ExamLibrary = {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  level: "easy" | "medium" | "hard";
  played: number;
  createdDate: string;
  updatedDate: string;
  tags: string[];
  author: string;
  type?: string;
};

export const dummyExamLibraries: ExamLibrary[] = [
  {
    id: "1",
    title: "Bài tập 1",
    description: "Bài tập 1",
    totalQuestions: 10,
    level: "easy",
    played: 10,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    tags: ["Toán, Lịch sử, Văn"],
    author: "admin",
  },
  {
    id: "2",
    title: "Bài tập 2",
    description: "Bài tập 2",
    totalQuestions: 10,
    level: "easy",
    played: 10,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    tags: ["Toán, Lịch sử, Văn"],
    author: "admin",
  },
  {
    id: "3",
    title: "Bài tập 3",
    description: "Bài tập 3",
    totalQuestions: 10,
    level: "easy",
    played: 10,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    tags: ["Toán, Lịch sử, Văn"],
    author: "admin",
  },
];
