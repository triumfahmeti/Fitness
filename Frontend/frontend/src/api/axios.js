import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7103",
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
            alert("Authentication error: JWT missing or invalid. Please login again.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("authUser");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
