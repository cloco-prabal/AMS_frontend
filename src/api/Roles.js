import axiosInstance from "@/utils/axiosInstance";

export const getRoles = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get("roles", {
      params: {
        page,
        pageSize,
      },
    });
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to fetch roles.");
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
