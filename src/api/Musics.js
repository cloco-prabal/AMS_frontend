import axiosInstance from "@/utils/axiosInstance";

export const getMusics = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get("musics", {
      params: {
        page,
        pageSize,
      },
    });
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to fetch musics.");
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
export const getMusicsByArtistId = async (
  page = 1,
  pageSize = 10,
  artistId
) => {
  try {
    const response = await axiosInstance.get(`artists/musics/${artistId}`, {
      params: {
        page,
        pageSize,
      },
    });
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to fetch musics.");
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

export const getMusicById = async (id) => {
  try {
    const response = await axiosInstance.get(`musics/${id}`);
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to fetch music");
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

export const updateMusic = async (id, data) => {
  try {
    const response = await axiosInstance.put(`musics/${id}`, data);
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to update music");
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data;
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};

export const addMusic = async (data) => {
  try {
    const response = await axiosInstance.post("/musics", data);

    if (response.data.errors) {
      throw new Error(response.data.message || "failed to add new music");
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

export const deleteMusic = async (id) => {
  try {
    const response = await axiosInstance.delete(`musics/${id}`);
    if (response.data.errors) {
      throw new Error(response.data.message || "Failed to delete the music");
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
