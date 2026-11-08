import axios from 'axios';

const configuredApiUrl =
  import.meta.env.VITE_API_URL || 'https://api.mercedezstudy.net/api/v1';
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, '');
const apiBaseUrl = normalizedApiUrl.endsWith('/api')
  ? `${normalizedApiUrl}/v1`
  : normalizedApiUrl.endsWith('/api/v1')
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api/v1`;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Tự động gửi JWT trong các request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token && config.headers.get('Authorization') !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Trả về response.data
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default apiClient;
