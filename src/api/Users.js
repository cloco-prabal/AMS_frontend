import axiosInstance from "@/utils/axiosInstance";

export const getUsers = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get("users", {
      params: {
        page,
        pageSize,
      },
    });
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to fetch users");
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

export const addUser = async (data) => {
  try {
    const response = await axiosInstance.post("users", data);

    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to create a new user.");
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

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`users/${id}`);
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to delete the user");
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
