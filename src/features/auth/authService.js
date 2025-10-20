import api from "../../services/api";

const register = async (userData) => {
  const response = await api.post("/registration", userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post("/login", userData);

  if (response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
  }

  return {
    token: response.data.data.token,
    user: userData.email,
  };
};

const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
