import { QuestionItem, Questionnaire, User } from "../types";
import Cookies from "js-cookie";
import axiosInstance from "./axios";

export const QuizAppAPI = {
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string }> => {
    const res = await axiosInstance.post("/login", { email, password });
    if (res.data.token) {
      Cookies.set("userToken", res.data.token, {
        path: "/",
      });
    }
    return res.data as { token: string };
  },

  verifyToken: async (): Promise<{ payload: User; message?: string }> => {
    const token = Cookies.get("userToken");
    const res = await axiosInstance.get("user/verifyToken", {
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
      Cookies.set("userToken", res.data.token, {
        path: "/",
      });
    }
    return res.data as { token: string };
  },

  updateProfile: async (payload: {
    username: string;
    currentPassword: string;
    newPassword?: string;
  }): Promise<{
    message: string;
    token: string;
    error?: string;
  }> => {
    const token = Cookies.get("userToken");

    const res = await axiosInstance.put("updateProfile", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.token) {
      Cookies.set("userToken", res.data.token, {
        path: "/",
      });
    }

    return res.data as { message: string; token: string; error?: string };
  },

  getAllQuestionnaires: async (): Promise<Questionnaire[]> => {
    const res = await axiosInstance.get("/getQuestionaire");
    return res.data as Questionnaire[];
  },

  getQuestionnaireToEditById: async (id: string): Promise<Questionnaire> => {
    const token = Cookies.get("userToken");

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
