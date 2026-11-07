
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
    token?: string;
    user: TelegramUser;
  };
}

export interface TelegramRegisterPayload {
  [key: string]: unknown;
}

/* =========================================
   SAVE AUTHENTICATION
========================================= */

const notifyTelegramAuth = (
  response: TelegramAuthResponse
): TelegramAuthResponse => {
  if (!response?.data?.user) {
    throw new Error("Dữ liệu đăng nhập Telegram không hợp lệ.");
  }

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
    const apiUrl = (
      import.meta.env.VITE_API_URL ||
      "https://api.mercedezstudy.net/api/v1"
    ).replace(/\/$/, "");

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

    return notifyTelegramAuth(
      response as unknown as TelegramAuthResponse
    );
  },
};

export default telegramAuthService;
