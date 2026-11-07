import axios from 'axios';

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000/api/v1',

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

    // Xử lý tự động khi Token hết hạn hoặc không hợp lệ (401)
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || '';
      if (
        msg.includes('token') ||
        msg.includes('Authentication') ||
        msg.includes('authorization')
      ) {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_id');
        localStorage.removeItem('adminName');
        localStorage.removeItem('userRole');

        if (
          typeof window !== 'undefined' &&
          window.location.pathname.startsWith('/admin') &&
          !window.location.pathname.includes('/admin/login')
        ) {
          window.location.href = '/admin/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
