import axios from "axios";
import Cookies from "js-cookie";
import { User } from "../types";

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
    const token = Cookies.get("adminToken");
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
      Cookies.remove("adminToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const AdminAPI = {
  login: async (
    email: string,
    password: string
  ): Promise<{
    token: string;
    message?: string;
  }> => {
    const res = await axiosInstance.post("/adminLogin", { email, password });
    if (res.data.token) {
      Cookies.set("adminToken", res.data.token, {
        path: "/",
      });
    }

    return res.data;
  },
  getDashboard: async () => {
    return axiosInstance.get("/admin/getDashboard");
  },
  verifyToken: async (): Promise<{
    payload: User;
    message?: string;
  }> => {
    const token = Cookies.get("adminToken");
    const res = await axiosInstance.get("admin/verifyToken", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },
  logout: async () => {
    Cookies.remove("adminToken");
  },

  getUsers: async (): Promise<{ users: User[] }> => {
    const res = await axiosInstance.get("/admin/getUsers");
    return res.data;
  },

  addNewUser: async (user: User): Promise<{ message: string }> => {
    const res = await axiosInstance.post("/admin/addUser", user);
    return res.data;
  },

  updateUserInfo: async (
    data: User
  ): Promise<{
    message: string;
  }> => {
    const res = await axiosInstance.put(`/admin/updateUser`, data);
    return res.data;
  },
};
