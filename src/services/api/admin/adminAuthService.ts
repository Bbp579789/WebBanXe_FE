
import { apiClient } from '../admin/apiClient';

import type {
  AdminLoginPayload,
  AdminLoginResponse,
  AdminInfo,
} from '../../../types/adminAuth.types';

interface BackendLoginResponse {
  message: string;
  status: number;
  token: string;
}

interface JwtPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

const decodeToken = (token: string): JwtPayload => {
  try {
    const payload = token.split('.')[1];

    const base64 = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const padded = base64.padEnd(
      base64.length + (4 - base64.length % 4) % 4,
      '='
    );

    const binary = atob(padded);

    const bytes = Uint8Array.from(
      binary,
      (char) => char.charCodeAt(0)
    );

    return JSON.parse(
      new TextDecoder().decode(bytes)
    );
  } catch {
    throw new Error('Token không hợp lệ');
  }
};

const adminAuthService = {

  // ADMIN LOGIN
  login: async (
    credentials: AdminLoginPayload
  ): Promise<AdminLoginResponse> => {

    // Xóa session Admin cũ trước khi đăng nhập
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_id');
    localStorage.removeItem('adminName');

    const response = await apiClient.post(
      '/auth/login',
      {
        email: credentials.email,
        password: credentials.password,
      }
    ) as unknown as BackendLoginResponse;

    if (!response?.token) {
      throw new Error('Backend không trả về token');
    }

    const payload = decodeToken(response.token);

    // QUAN TRỌNG: Chỉ cho phép role ADMIN
    if (payload.role?.toLowerCase() !== 'admin') {
      throw new Error(
        'Tài khoản không có quyền Admin. Vui lòng sử dụng tài khoản Admin!'
      );
    }

    // Kiểm tra hạn sử dụng token
    if (
      !payload.exp ||
      payload.exp * 1000 <= Date.now()
    ) {
      throw new Error('Phiên đăng nhập đã hết hạn');
    }

    if (!payload.userId) {
      throw new Error('Không tìm thấy thông tin Admin');
    }

    const admin: AdminInfo = {
      id: payload.userId,
      role: 'admin',
    };

    // Chỉ lưu token sau khi xác nhận role Admin
    localStorage.setItem('admin_access_token', response.token);
    localStorage.setItem('admin_id', String(payload.userId));
    localStorage.setItem('adminName', credentials.email);
    localStorage.setItem('userRole', 'admin');

    return {
      success: true,
      message: response.message,
      token: response.token,
      admin,
    };
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_id');
    localStorage.removeItem('adminName');
    localStorage.removeItem('userRole');

    window.location.href = '/admin/login';
  },

  // CHECK AUTHENTICATION
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('admin_access_token');

    if (!token) return false;

    try {
      const payload = decodeToken(token);

      return (
        payload.role?.toLowerCase() === 'admin' &&
        payload.exp * 1000 > Date.now()
      );
    } catch {
      return false;
    }
  },

  // GET ADMIN INFO
  getAdminInfo: (): AdminInfo | null => {
    const token = localStorage.getItem('admin_access_token');

    if (!token) return null;

    try {
      const payload = decodeToken(token);

      if (
        payload.role?.toLowerCase() !== 'admin' ||
        payload.exp * 1000 <= Date.now()
      ) {
        return null;
      }

      return {
        id: payload.userId,
        role: 'admin',
      };
    } catch {
      return null;
    }
  },
};

export default adminAuthService;
export { adminAuthService };
