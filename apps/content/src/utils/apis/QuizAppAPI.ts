import axios from "axios";
import { QuestionItem, Questionnaire, User } from "../types";
import Cookies from "js-cookie";

const BASE_URL = process.env.BASE_URL;

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  config.headers["Content-Type"] = "application/json";
  config.withCredentials = true;
  return config;
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const QuizAppAPI = {
  loginWithEmailandPassword: async (
    email: string,
    password: string
  ): Promise<{ token: string }> => {
    const res = await axiosInstance.post("/login", { email, password });
    if (res.data.token) {
      Cookies.set("token", res.data.token, {
        path: "/",
      });
    }
    return res.data as { token: string };
  },

  verifyToken: async (): Promise<{ payload: User; message?: string }> => {
    const token = Cookies.get("token");
    console.log("token", token);
    const res = await axiosInstance.get("/verifyToken", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data as { payload: User; error?: string };
  },

  registerWithEmailandPassword: async (
    username: string,
    email: string,
    password: string
  ): Promise<{ token: string }> => {
    const res = await axiosInstance.post("/register", {
      username,
      email,
      password,
    });

    if (res.data.token) {
      Cookies.set("token", res.data.token, {
        path: "/",
      });
    }
    return res.data as { token: string };
  },

  getAllQuestionnaires: async (): Promise<Questionnaire[]> => {
    const res = await axiosInstance.get("/getQuestionaire");
    return res.data as Questionnaire[];
  },
  getQuestionnaireToEditById: async (id: string): Promise<Questionnaire> => {
    const token = Cookies.get("token");

    const res = await axiosInstance.get(`user/getQuestionaireToEdit/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data as Questionnaire;
  },
  examQuestionaire: async (id: string): Promise<QuestionItem[]> => {
    const res = await axiosInstance.get(`user/examQuestionaire/${id}`);
    return res.data as QuestionItem[];
  },
  addQuestionnaire: async (questionnaire: Questionnaire) => {
    const res = await axiosInstance.post("user/addQuestionaire", questionnaire);
    return res.data;
  },
  deleteQuestionnaire: async (id: string) => {
    const res = await axiosInstance.delete(`user/deleteQuestionaire/${id}`);
    return res.data;
  },
  updateQuestionnaire: async (id: string, questionnaire: Questionnaire) => {
    const res = await axiosInstance.put(
      `user/updateQuestionaire/${id}`,
      questionnaire
    );
    return res.data;
  },
  submitAnswer: async (
    id: string,
    answerData: QuestionItem[]
  ): Promise<{ score: string }> => {
    const res = await axiosInstance.post(`user/submitAnswer/${id}`, answerData);
    return res.data as { score: string };
  },
};
