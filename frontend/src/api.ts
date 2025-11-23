import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ==========================
// INTERCEPTOR CHUẨN
// ==========================
api.interceptors.request.use(
    (config) => {
        // Không gửi token với các API auth
        if (!config.url?.includes("/auth/")) {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
