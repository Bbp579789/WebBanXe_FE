import axios from 'axios';

// Dùng baseURL là '/api' để request đi qua proxy Vite, tránh bị lỗi CORS
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ví dụ các hàm gọi endpoint:
export const getVehicles = () => api.get('/vehicles');
export const getUsers = () => api.get('/users');