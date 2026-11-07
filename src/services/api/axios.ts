// // import axios from 'axios';

// // // Dùng baseURL là '/api' để request đi qua proxy Vite, tránh bị lỗi CORS
// // export const api = axios.create({
// //   baseURL: '/api',
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // Ví dụ các hàm gọi endpoint:
// // export const getVehicles = () => api.get('/vehicles');
// // export const getUsers = () => api.get('/users');

// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Tự động thêm JWT nếu người dùng đã đăng nhập
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;