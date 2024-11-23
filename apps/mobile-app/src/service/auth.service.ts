import { axiosInstance } from "../utils/axiosInstance";

export const register = async (displayName: string) => {
  const response = await axiosInstance.post("/player/api/register", {
    name: displayName,
  });
  return response.data;
};

export const getMyInformation = async (): Promise<{
  id: string;
  displayName: string;
}> => {
  const response = await axiosInstance.get("/player/api/me");
  return response.data;
};
