
import { useState, useCallback } from 'react';

import adminAuthService from '../../services/api/admin/adminAuthService';

import type {
  AdminInfo,
  AdminLoginPayload,
  UseAdminAuthReturn,
} from '../../types/adminAuth.types';

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [admin, setAdmin] = useState<AdminInfo | null>(() => {
    if (!adminAuthService.isAuthenticated()) {
      return null;
    }

    return adminAuthService.getAdminInfo();
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => adminAuthService.isAuthenticated()
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // LOGIN ADMIN
  const login = useCallback(
    async (credentials: AdminLoginPayload): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await adminAuthService.login(credentials);

        const adminInfo = adminAuthService.getAdminInfo();

        if (!adminInfo) {
          throw new Error('Không thể lấy thông tin Admin');
        }

        setAdmin(adminInfo);
        setIsAuthenticated(true);

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Đăng nhập thất bại';

        setError(message);
        setAdmin(null);
        setIsAuthenticated(false);

        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // LOGOUT ADMIN
  const logout = useCallback(() => {
    adminAuthService.logout();

    setAdmin(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // CLEAR ERROR
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    admin,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
  };
};

export default useAdminAuth;
