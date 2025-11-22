import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // backend Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================================
// BẮT ĐẦU PHẦN THÊM MỚI: INTERCEPTOR
// ===================================
api.interceptors.request.use(
  (config) => {
    // 1. Lấy token từ localStorage (nơi chúng ta lưu sau khi đăng nhập)
    const token = localStorage.getItem('token');

    // 2. Nếu có token, thêm header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ===================================
// KẾT THÚC PHẦN THÊM MỚI
// ===================================

export default api;