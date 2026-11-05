import axios from 'axios';

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://api.mercedezstudy.net/api/v1',

  headers: {
    'Content-Type': 'application/json',
  },

  timeout: 15000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Không gửi token Admin khi gọi API login
    if (config.url?.includes('/auth/login')) {
      return config;
    }

    const token = localStorage.getItem('admin_access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error(
      'Admin API Error:',
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default apiClient;
