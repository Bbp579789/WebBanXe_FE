import { apiClient } from "./apiClient";

export interface RegisterDTO {
  username?: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
}

export interface AuthUser {
  id?: number;
  username?: string;
  email?: string;
  full_name?: string;
  name?: string;
  phone?: string;
  address?: string | null;
  role?: string;
}

const unwrapUser = (response: unknown): AuthUser | null => {
  let value = response as { data?: unknown; user?: AuthUser } | null;

  for (let depth = 0; depth < 3 && value?.data && typeof value.data === "object"; depth += 1) {
    value = value.data as { data?: unknown; user?: AuthUser };
  }

  if (value?.user && typeof value.user === "object") return value.user;
  return value && typeof value === "object" && ("id" in value || "email" in value)
    ? value as AuthUser
    : null;
};

const saveUserProfile = (user: AuthUser) => {
  const name = user.full_name || user.name || user.username;
  if (name) localStorage.setItem("userName", name);
  if (user.email) localStorage.setItem("userEmail", user.email);
  if (user.phone) localStorage.setItem("userPhone", user.phone);
};

export const authService = {
  register: async (payload: RegisterDTO) => apiClient.post("/auth/register", payload),

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login", credentials);
    const user = unwrapUser(response);
    if (user) saveUserProfile(user);
    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("cartChange"));
    return { response, user };
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiClient.get("/users/me");
    const user = unwrapUser(response);
    if (!user) throw new Error("Backend không trả về thông tin người dùng.");
    saveUserProfile(user);
    return user;
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      window.dispatchEvent(new Event("authChange"));
      window.dispatchEvent(new Event("cartChange"));
    }
  },
};

export default authService;
