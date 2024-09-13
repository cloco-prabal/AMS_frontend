import axiosInstance from "@/utils/axiosInstance";

export const getArtists = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get("artists", {
      params: {
        page,
        pageSize,
      },
    });
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to fetch artists.");
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

export const addArtist = async (data) => {
  try {
    const response = await axiosInstance.post("/artists", data);

    if (response.data.errors) {
      throw new Error(response.data.message || "failed to add new artist");
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

export const deleteArtist = async (id) => {
  try {
    const response = await axiosInstance.delete(`artists/${id}`);
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to delete the artist");
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
