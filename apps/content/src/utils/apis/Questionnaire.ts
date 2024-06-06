import axios from "axios";
import { QuestionWithCorrectAnswer, Questionnaire } from "../types";

const BASE_URL = "https://api.ducvu.name.vn";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  return config;
});

export const QuizAppAPI = {
  getAllQuestionnaires: async (): Promise<Questionnaire[]> => {
    const res = await axiosInstance.get("/getQuestionaire");
    return res.data as Questionnaire[];
  },
  getQuestionnaireById: async (id: string): Promise<Questionnaire> => {
    const res = await axiosInstance.get(`/getQuestionaire/${id}`);
    return res.data as Questionnaire;
  },
  addQuestionnaire: async (questionnaire: QuestionWithCorrectAnswer) => {
    const res = await axiosInstance.post("/addQuestionaire", questionnaire);
    return res.data;
  },
  deleteQuestionnaire: async (id: string) => {
    const res = await axiosInstance.delete(`/deleteQuestionaire/${id}`);
    return res.data;
  },
  updateQuestionnaire: async (id: string, questionnaire: Questionnaire) => {
    const res = await axiosInstance.put(
      `/updateQuestionaire/${id}`,
      questionnaire
    );
    return res.data;
  },
  // TODO: "Implement submitAnswer",
  submitAnswer: async (id: string, answer: string) => {},
};
