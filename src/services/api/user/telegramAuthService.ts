
import apiClient from "./apiClient";
import { saveCustomerSession } from "./authService";

const LOGIN_VERIFIER_KEY = "telegram_session_verifier";
const LOGIN_CODE_PARAM = "telegram_code";
let exchangeRequest: Promise<void> | undefined;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

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
  login: async (): Promise<void> => {
    const verifier = toHex(crypto.getRandomValues(new Uint8Array(32)));
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    const challenge = toHex(new Uint8Array(digest));
    sessionStorage.setItem(LOGIN_VERIFIER_KEY, verifier);

    // Để phiên Telegram mới được ưu tiên khi quay về bằng cookie.
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    window.location.assign(apiClient.getUri({
      url: "/auth/telegram/login",
      params: { session_challenge: challenge },
    }));
  },

  completeLoginFromRedirect: (): Promise<void> | undefined => {
    if (exchangeRequest) return exchangeRequest;

    const url = new URL(window.location.href);
    const code = url.searchParams.get(LOGIN_CODE_PARAM);
    if (!code) return;
    url.searchParams.delete(LOGIN_CODE_PARAM);
    window.history.replaceState(window.history.state, "", url);

    const verifier = sessionStorage.getItem(LOGIN_VERIFIER_KEY);
    sessionStorage.removeItem(LOGIN_VERIFIER_KEY);
    if (!verifier) return;

    exchangeRequest = apiClient.post<TelegramAuthResponse>("/auth/telegram/exchange", { code, verifier })
      .then((response) => {
        const payload = response as unknown as TelegramAuthResponse;
        if (!payload.data?.token || !payload.data?.user) {
          throw new Error("Dữ liệu đăng nhập Telegram không hợp lệ.");
        }
        const { token, user } = payload.data;
        saveCustomerSession(token, {
          ...user,
          email: user.email ?? undefined,
          phone: user.phone ?? undefined,
        });
      })
      .finally(() => {
        exchangeRequest = undefined;
      });
    return exchangeRequest;
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
