

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


import { apiClient } from "./apiClient";

export interface RegisterDTO {
  username?: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
}

interface AuthUser {
  username?: string;
  email?: string;
  full_name?: string;
  phone?: string;
}

interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  user?: AuthUser;
  data?: AuthResponse;
}

export const authService = {
  register: async (payload: RegisterDTO) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    const body = response.data;
    const authData = body.data?.data ?? body.data ?? body;

    const token =
      authData.token ??
      authData.accessToken ??
      authData.access_token;

    const user = authData.user ?? body.user;

    if (token) {
      // Lưu cả hai key để tương thích với các API client hiện tại.
      localStorage.setItem("access_token", token);
      localStorage.setItem("accessToken", token);

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

      localStorage.setItem("userPhone", user?.phone || "");

      window.dispatchEvent(new Event("authChange"));
      window.dispatchEvent(new Event("cartChange"));
    }

    return body;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("cartChange"));
  },
};

export default authService;