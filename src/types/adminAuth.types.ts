
export type AdminRole = 'admin';

export interface AdminLoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminInfo {
  id: number;
  role: AdminRole;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AdminInfo;
}

export interface AdminAuthState {
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UseAdminAuthReturn extends AdminAuthState {
  login: (credentials: AdminLoginPayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}
