
import apiClient from "./apiClient";

const API_ORIGIN = "https://api.mercedezstudy.net";
const TELEGRAM_LOGIN_URL = `${API_ORIGIN}/api/v1/auth/telegram/login`;

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
   * Chuyển trình duyệt sang Telegram OAuth để backend tạo state và cookie mới.
   * Không dùng fetch vì endpoint này phải được mở như một browser navigation.
   */
  login: (): void => {
    // Telegram uses an HttpOnly cookie. Do not let a stale website token
    // override the cookie on the first /users/me request after redirect.
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    window.location.assign(TELEGRAM_LOGIN_URL);
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
