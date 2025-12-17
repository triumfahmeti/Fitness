import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7103",
  withCredentials: true, // only if you plan to use cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // token invalid or expired
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
      window.location.href = "/login"; // redirect
    }
    return Promise.reject(error);
  }
);

export default api;
