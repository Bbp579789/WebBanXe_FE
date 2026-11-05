

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
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");

    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("cartChange"));
  },

  // Kiểm tra đăng nhập customer
  isCustomer: () => {
    return (
      !!localStorage.getItem("access_token") &&
      localStorage.getItem("userRole") === "customer"
    );
  },
};

export default authService;
