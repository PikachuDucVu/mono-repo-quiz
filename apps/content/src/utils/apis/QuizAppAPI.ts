import axios from "axios";
import { QuestionItem, Questionnaire } from "../types";

const BASE_URL = "https://api.ducvu.name.vn";
// const BASE_URL = "http://localhost:3000";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  return config;
});

export const QuizAppAPI = {
  loginWithEmailandPassword: async (
    email: string,
    password: string
  ): Promise<{ payload: string; token: string }> => {
    const res = await axiosInstance.post("/login", { email, password });
    return res.data as { payload: string; token: string };
  },
  registerWithEmailandPassword: async (
    username: string,
    email: string,
    password: string
  ): Promise<{ payload: string; token: string }> => {
    const res = await axiosInstance.post("/register", {
      username,
      email,
      password,
    });
    return res.data as { payload: string; token: string };
  },

  getAllQuestionnaires: async (): Promise<Questionnaire[]> => {
    const res = await axiosInstance.get("/getQuestionaire");
    return res.data as Questionnaire[];
  },
  getQuestionnaireToEditById: async (id: string): Promise<Questionnaire> => {
    const res = await axiosInstance.get(`/getQuestionaireToEdit/${id}`);
    console.log(res.data);
    return res.data as Questionnaire;
  },
  examQuestionaire: async (id: string): Promise<QuestionItem[]> => {
    const res = await axiosInstance.get(`/examQuestionaire/${id}`);
    return res.data as QuestionItem[];
  },
  addQuestionnaire: async (questionnaire: Questionnaire) => {
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
  submitAnswer: async (
    id: string,
    answerData: QuestionItem[]
  ): Promise<{ score: string }> => {
    const res = await axiosInstance.post(`/submitAnswer/${id}`, answerData);
    return res.data as { score: string };
  },
};
