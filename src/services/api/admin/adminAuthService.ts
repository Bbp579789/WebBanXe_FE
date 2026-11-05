import { apiClient } from '../apiClient';

export interface AdminLoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const adminAuthService = {
  login: async (credentials: AdminLoginPayload) => {
    // Đảm bảo endpoint BE chuẩn với đường dẫn của bạn
    const res: any = await apiClient.post('/auth/admin/login', credentials);
    
    const token = res.token || res.accessToken || res.data?.token || res.access_token;
    const adminData = res.admin || res.user || res.data?.admin || res.data?.user;

    if (token) {
      localStorage.setItem('admin_access_token', token);
      localStorage.setItem('adminName', adminData?.full_name || adminData?.username || credentials.email.split('@')[0]);
      localStorage.setItem('userRole', 'admin');
    }
    
    return res;
  },

  logout: () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('adminName');
    localStorage.removeItem('userRole');
    window.location.href = '/admin/login';
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_access_token');
  }
};

export default adminAuthService;