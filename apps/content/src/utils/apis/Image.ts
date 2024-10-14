import axiosInstance from "./axios";

export const postImage = async ({ image }) => {
  const formData = new FormData();
  formData.append("image", image);

  return await axiosInstance.post("/user/image/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
