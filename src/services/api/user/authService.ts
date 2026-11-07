
// import { apiClient } from "./apiClient";

// export interface RegisterDTO {
//   username?: string;
//   email: string;
//   password: string;
//   full_name: string;
//   phone?: string;
//   address?: string;
// }

// export interface AuthUser {
//   id?: number;
//   username?: string;
//   email?: string;
//   full_name?: string;
//   name?: string;
//   phone?: string;
//   address?: string | null;
//   role?: string;
// }

// type ApiData = {
//   data?: unknown;
//   user?: AuthUser;
//   id?: number;
//   email?: string;
//   username?: string;
//   full_name?: string;
//   name?: string;
//   phone?: string;
//   address?: string | null;
//   role?: string;
// };

// const unwrapUser = (response: unknown): AuthUser | null => {
//   let value: unknown = response;

//   // Bóc tối đa 3 lớp data
//   for (let depth = 0; depth < 3; depth += 1) {
//     if (!value || typeof value !== "object") break;

//     const current = value as ApiData;

//     if (current.user && typeof current.user === "object") {
//       return current.user;
//     }

//     if (current.data && typeof current.data === "object") {
//       value = current.data;
//       continue;
//     }

//     break;
//   }

//   if (!value || typeof value !== "object") return null;

//   const user = value as ApiData;

//   if (
//     user.id !== undefined ||
//     user.email !== undefined ||
//     user.username !== undefined
//   ) {
//     return user as AuthUser;
//   }

//   return null;
// };

// const saveUserProfile = (user: AuthUser) => {
//   const name = user.full_name || user.name || user.username;

//   if (name) localStorage.setItem("userName", name);
//   if (user.email) localStorage.setItem("userEmail", user.email);
//   if (user.phone) localStorage.setItem("userPhone", user.phone);
// };

// export const authService = {
//   // POST /api/v1/auth/register
//   register: async (payload: RegisterDTO) => {
//     const response = await apiClient.post("/auth/register", payload);
//     return response;
//   },

//   // POST /api/v1/auth/login
//   login: async (credentials: {
//     email: string;
//     password: string;
//   }) => {
//     const response = await apiClient.post("/auth/login", credentials);

//     const user = unwrapUser(response);

//     if (user) {
//       saveUserProfile(user);
//     }

//     window.dispatchEvent(new Event("authChange"));
//     window.dispatchEvent(new Event("cartChange"));

//     return { response, user };
//   },

//   // GET /api/v1/users/me
//   getCurrentUser: async (): Promise<AuthUser> => {
//     const response = await apiClient.get("/users/me");

//     const user = unwrapUser(response);

//     if (!user) {
//       throw new Error("Backend không trả về thông tin người dùng.");
//     }

//     saveUserProfile(user);

//     return user;
//   },

//   // POST /api/v1/auth/logout
//   logout: async () => {
//     try {
//       await apiClient.post("/auth/logout");
//     } finally {
//       localStorage.removeItem("userName");
//       localStorage.removeItem("userEmail");
//       localStorage.removeItem("userPhone");

//       window.dispatchEvent(new Event("authChange"));
//       window.dispatchEvent(new Event("cartChange"));
//     }
//   },
// };

// export default authService;



// // import axios from 'axios';
// import { apiClient } from "./apiClient";

// export interface RegisterDTO {
//   username?: string;
//   email: string;
//   password: string;
//   full_name: string;
//   phone?: string;
//   address?: string;
// }

// interface AuthUser {
//   username?: string;
//   email?: string;
//   full_name?: string;
//   phone?: string;
// }

// interface AuthResponse {
//   token?: string;
//   accessToken?: string;
//   access_token?: string;
//   user?: AuthUser;
//   data?: AuthResponse;
// }

// export const authService = {
//   // Đăng ký tài khoản
//   register: async (payload: RegisterDTO) => {
//     const response = await apiClient.post(
//       "/auth/register",
//       payload
//     );

//     return response.data;
//   },

//   // Đăng nhập và lưu thông tin người dùng
//   login: async (credentials: {
//     email: string;
//     password: string;
//   }) => {
//     const response = await apiClient.post<AuthResponse>(
//       "/auth/login",
//       credentials
//     );

//     const body = response.data;
//     const authData = body.data?.data ?? body.data ?? body;

//     const token =
//       authData.token ??
//       authData.accessToken ??
//       authData.access_token;

//     const user = authData.user ?? body.user;

//     if (token) {
//       localStorage.setItem("access_token", token);

//       localStorage.setItem(
//         "userName",
//         user?.full_name ||
//           user?.username ||
//           credentials.email.split("@")[0]
//       );

//       localStorage.setItem(
//         "userEmail",
//         user?.email || credentials.email
//       );

//       localStorage.setItem("userPhone", user?.phone || "");

//       window.dispatchEvent(new Event("authChange"));
//       window.dispatchEvent(new Event("cartChange"));
//     }

//     return body;
//   },

//   // Đăng xuất
//   logout: () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userPhone");

//     window.dispatchEvent(new Event("authChange"));
//     window.dispatchEvent(new Event("cartChange"));
//   },
// };

// export default authService;


// import { apiClient } from "./apiClient";

// export interface RegisterDTO {
//   username?: string;
//   email: string;
//   password: string;
//   full_name: string;
//   phone?: string;
//   address?: string;
// }

// interface AuthUser {
//   username?: string;
//   email?: string;
//   full_name?: string;
//   phone?: string;
// }

// interface AuthResponse {
//   token?: string;
//   accessToken?: string;
//   access_token?: string;
//   user?: AuthUser;
//   data?: AuthResponse;
// }

// const getAuthData = (response: any): AuthResponse => {
//   let result = response;

//   // Bóc các lớp data lồng nhau nếu Backend trả về.
//   while (
//     result?.data &&
//     typeof result.data === "object" &&
//     !Array.isArray(result.data)
//   ) {
//     result = result.data;
//   }

//   return result;
// };

// export const authService = {
//   // Đăng ký
//   register: async (payload: RegisterDTO) => {
//     const response = await apiClient.post(
//       "/auth/register",
//       payload
//     );

//     return response;
//   },

//   // Đăng nhập
//   login: async (credentials: {
//     email: string;
//     password: string;
//   }) => {
//     const response = await apiClient.post<AuthResponse>(
//       "/auth/login",
//       credentials
//     );

//     console.log("LOGIN RESPONSE:", response);

//     const authData = getAuthData(response);

//     const token =
//       authData.token ||
//       authData.accessToken ||
//       authData.access_token;

//     const user = authData.user;

//     if (!token) {
//       console.error("Không tìm thấy JWT trong response:", response);
//       throw new Error(
//         "Đăng nhập thành công nhưng Backend không trả về access token."
//       );
//     }

//     // Lưu JWT để tương thích với các Axios instance hiện tại.
//     localStorage.setItem("access_token", token);
//     localStorage.setItem("accessToken", token);

//     // Lưu thông tin người dùng.
//     localStorage.setItem(
//       "userName",
//       user?.full_name ||
//         user?.username ||
//         credentials.email.split("@")[0]
//     );

//     localStorage.setItem(
//       "userEmail",
//       user?.email || credentials.email
//     );

//     localStorage.setItem(
//       "userPhone",
//       user?.phone || ""
//     );

//     // Thông báo cho các component cập nhật trạng thái.
//     window.dispatchEvent(new Event("authChange"));
//     window.dispatchEvent(new Event("cartChange"));

//     return response;
//   },

//   // Đăng xuất
//   logout: () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("accessToken");

//     localStorage.removeItem("userName");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userPhone");

//     window.dispatchEvent(new Event("authChange"));
//     window.dispatchEvent(new Event("cartChange"));
//   },
// };

// export default authService;



import { apiClient } from "./apiClient";
import { TELEGRAM_AUTH_PENDING_KEY } from "./telegramAuthService";

export interface RegisterDTO {
  username?: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
}

interface AuthUser {
  id?: number;
  username?: string;
  email?: string;
  full_name?: string;
  name?: string;
  phone?: string;
  role?: string;
}

interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  role?: string;
  user?: AuthUser;
  data?: AuthResponse;
}

const getAuthData = (response: any): AuthResponse => {
  let result = response;

  while (
    result?.data &&
    typeof result.data === "object" &&
    !Array.isArray(result.data)
  ) {
    result = result.data;
  }

  return result;
};

const saveUserProfile = (user: AuthUser) => {
  const name = user.full_name || user.name || user.username;

  if (name) localStorage.setItem("userName", name);
  if (user.email) localStorage.setItem("userEmail", user.email);
  if (user.phone) localStorage.setItem("userPhone", user.phone);
  if (user.role?.toLowerCase() === "customer") {
    localStorage.setItem("userRole", "customer");
  }
};

// Đọc role từ JWT nếu Backend không trả role trong user.
const getRoleFromToken = (token: string): string | undefined => {
  try {
    const payload = token.split(".")[1];

    if (!payload) return undefined;

    const decoded = JSON.parse(
      atob(
        payload.replace(/-/g, "+").replace(/_/g, "/")
      )
    );

    return decoded.role || decoded.user?.role;
  } catch {
    return undefined;
  }
};

export const authService = {
  // Đăng ký
  register: async (payload: RegisterDTO) => {
    return await apiClient.post("/auth/register", payload);
  },

  // Đăng nhập website User: chỉ cho phép customer
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    console.log("LOGIN RESPONSE:", response);

    const authData = getAuthData(response);

    const token =
      authData.token ||
      authData.accessToken ||
      authData.access_token;

    const user = authData.user;

    if (!token) {
      throw new Error(
        "Đăng nhập thất bại: Backend không trả về access token."
      );
    }

    // Lấy role từ response hoặc JWT.
    const role =
      user?.role ||
      authData.role ||
      getRoleFromToken(token);

    console.log("LOGIN ROLE:", role);

    // Không xác định được role thì không cho đăng nhập.
    if (!role) {
      throw new Error(
        "Không xác định được quyền tài khoản. Vui lòng kiểm tra response đăng nhập từ Backend."
      );
    }

    // Chỉ customer được đăng nhập website User.
    if (role.toLowerCase() !== "customer") {
      throw new Error(
        "Tài khoản này không có quyền đăng nhập website khách hàng."
      );
    }

    // Chỉ lưu token sau khi xác nhận đúng role customer.
    localStorage.setItem("access_token", token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userRole", "customer");

    localStorage.setItem(
      "userName",
      user?.full_name ||
        user?.username ||
        credentials.email.split("@")[0]
    );

    localStorage.setItem(
      "userEmail",
      user?.email || credentials.email
    );

    localStorage.setItem(
      "userPhone",
      user?.phone || ""
    );

    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("cartChange"));

    return response;
  },

  // Đăng xuất
  logout: () => {
    void apiClient.post("/auth/logout").catch((error: unknown) => {
      console.error("Logout request failed:", error);
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");

    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("cartChange"));
  },

  // Kiểm tra phiên đăng nhập bằng HttpOnly cookie.
  getCurrentUser: async (): Promise<AuthUser> => {
    let response: unknown;
    const isTelegramCallback =
      sessionStorage.getItem(TELEGRAM_AUTH_PENDING_KEY) === "true";

    // The Telegram callback authenticates with the HttpOnly cookie. Do not
    // let an old browser token override that cookie on this first request.
    if (isTelegramCallback) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("accessToken");
    }

    try {
      response = await apiClient.get<AuthUser>("/users/me");
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;

      // Retry once with cookie authentication if an old local JWT was rejected.
      if (status !== 401 && status !== 403) throw error;

      localStorage.removeItem("access_token");
      localStorage.removeItem("accessToken");
      response = await apiClient.get<AuthUser>("/users/me");
    }

    const data = getAuthData(response);
    const user = data.user || (data as AuthUser);

    if (!user || typeof user !== "object") {
      throw new Error("Backend không trả về thông tin người dùng.");
    }

    saveUserProfile(user);
    if (isTelegramCallback) {
      sessionStorage.removeItem(TELEGRAM_AUTH_PENDING_KEY);
    }
    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("cartChange"));

    return user;
  },

  // Kiểm tra đăng nhập customer
  isCustomer: () => {
    return (
      localStorage.getItem("userRole") === "customer"
    );
  },
};

export default authService;