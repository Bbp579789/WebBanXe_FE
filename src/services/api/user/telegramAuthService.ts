
import apiClient from "./apiClient";

/* =========================================
   TELEGRAM TYPES
========================================= */

export interface TelegramUser {
  id: number;
  username: string;
  full_name: string;
  role: "customer" | "admin" | "sales";
  address: string | null;
  phone: string | null;
  email: string | null;
}

export interface TelegramAuthResponse {
  message: string;
  data: {
    token: string;
    user: TelegramUser;
  };
}

export interface TelegramRegisterPayload {
  [key: string]: unknown;
}

/* =========================================
   SAVE AUTHENTICATION
========================================= */

const saveTelegramAuth = (
  response: TelegramAuthResponse
): TelegramAuthResponse => {
  const token = response?.data?.token;
  const user = response?.data?.user;

  if (!token || !user) {
    throw new Error("Dữ liệu đăng nhập Telegram không hợp lệ.");
  }

  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(user));

  window.dispatchEvent(new Event("authChange"));

  return response;
};

/* =========================================
   TELEGRAM AUTH SERVICE
========================================= */

export const telegramAuthService = {
  /**
   * GET /auth/telegram/login
   * Chuyển trình duyệt sang Telegram OAuth.
   */
  login: (): void => {
    const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

    if (!apiUrl) {
      throw new Error("VITE_API_URL chưa được cấu hình.");
    }

    window.location.assign(
      `${apiUrl}/auth/telegram/login`
    );
  },

  /**
   * POST /auth/telegram/register
   * Đăng ký tài khoản bằng hồ sơ Telegram.
   */
  register: async (
    payload: TelegramRegisterPayload
  ): Promise<TelegramAuthResponse> => {
    const response = await apiClient.post(
      "/auth/telegram/register",
      payload
    );

    return saveTelegramAuth(
      response as unknown as TelegramAuthResponse
    );
  },
};

export default telegramAuthService;
