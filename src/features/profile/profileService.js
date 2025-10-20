import api from "../../services/api";

const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data.data;
};

const updateProfile = async (userData) => {
  const response = await api.put("/profile/update", userData);
  return response.data.data;
};

const updateProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await api.put("/profile/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

const profileService = {
  getProfile,
  updateProfile,
  updateProfileImage,
};

export default profileService;
