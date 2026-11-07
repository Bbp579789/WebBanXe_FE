
import apiClient from "./apiClient";

const API_ORIGIN = "https://api.mercedezstudy.net";
const TELEGRAM_LOGIN_URL = `${API_ORIGIN}/api/v1/auth/telegram/login`;
export const TELEGRAM_AUTH_PENDING_KEY = "telegram_auth_pending";
// Backend redirect về frontend kèm mã một-lần (?telegram_code=...)
// sau khi người dùng xác thực thành công ở Telegram.
export const TELEGRAM_LOGIN_CODE_PARAM = "telegram_code";

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

// Lưu phiên Telegram y hệt luồng đăng nhập email (token + profile vào
// localStorage) rồi báo cho Header/useCart cập nhật giao diện ngay.
const saveTelegramSession = (
  token: string,
  user: TelegramUser
): void => {
  localStorage.setItem("access_token", token);
  localStorage.setItem("accessToken", token);

  const displayName = user.full_name || user.username;
  if (displayName) localStorage.setItem("userName", displayName);
  if (user.email) localStorage.setItem("userEmail", user.email);
  if (user.phone) localStorage.setItem("userPhone", user.phone);
  if (user.role?.toLowerCase() === "customer") {
    localStorage.setItem("userRole", "customer");
  }

  sessionStorage.removeItem(TELEGRAM_AUTH_PENDING_KEY);

  window.dispatchEvent(new Event("authChange"));
  window.dispatchEvent(new Event("cartChange"));
};

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
    sessionStorage.setItem(TELEGRAM_AUTH_PENDING_KEY, "true");
    window.location.assign(TELEGRAM_LOGIN_URL);
  },

  /**
   * POST /auth/telegram/exchange
   * Đổi mã telegram_code (một-lần, TTL 5 phút) lấy JWT + user,
   * từ đó tự động đăng nhập giống hệt luồng đăng nhập email.
   */
  exchangeLoginCode: async (code: string): Promise<void> => {
    const response = await apiClient.post("/auth/telegram/exchange", {
      code,
    });

    const payload = response as unknown as TelegramAuthResponse;

    if (!payload?.data?.token || !payload?.data?.user) {
      throw new Error("Dữ liệu đăng nhập Telegram không hợp lệ.");
    }

    saveTelegramSession(payload.data.token, payload.data.user);
  },

  /**
   * Xử lý khi trình duyệt quay về từ Telegram OAuth
   * (backend redirect kèm ?telegram_code=...).
   * Gỡ mã khỏi URL ngay, đổi mã lấy JWT rồi tự động đăng nhập.
   * @returns true nếu đã hoàn tất đăng nhập Telegram.
   */
  completeLoginFromRedirect: async (): Promise<boolean> => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get(TELEGRAM_LOGIN_CODE_PARAM);

    if (!code) {
      // Không quay về từ Telegram (ví dụ người dùng nhấn Back):
      // tắt chế độ chờ cookie để không ảnh hưởng phiên đăng nhập hiện có.
      sessionStorage.removeItem(TELEGRAM_AUTH_PENDING_KEY);
      return false;
    }

    // Gỡ mã khỏi URL ngay để không bị giữ lại trong history / referer.
    searchParams.delete(TELEGRAM_LOGIN_CODE_PARAM);
    const remainingSearch = searchParams.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${
        remainingSearch ? `?${remainingSearch}` : ""
      }${window.location.hash}`
    );

    await telegramAuthService.exchangeLoginCode(code);
    return true;
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
