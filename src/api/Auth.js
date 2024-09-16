import axiosInstance from "@/utils/axiosInstance";

export const login = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);

    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to log in");
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};
