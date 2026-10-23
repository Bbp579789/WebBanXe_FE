// import { apiClient } from './apiClient';

// export interface RegisterDTO {
//   username?: string;
//   email: string;
//   password: string;
//   full_name: string;
//   phone?: string;
//   address?: string;
// }

// export const authService = {
//   // 1. Gửi thông tin đăng ký sang backend
//   register: async (payload: RegisterDTO) => {
//     return await apiClient.post('/auth/register', payload);
//   },

//   // 2. Tự động đăng nhập lấy Token và thông tin User
//   login: async (credentials: { email: string; password: string }) => {
//     const res: any = await apiClient.post('/auth/login', credentials);
//     const token = res.token || res.accessToken;
//     if (token) {
//       localStorage.setItem('access_token', token);
//       localStorage.setItem('userName', res.user?.full_name || credentials.email);
//       window.dispatchEvent(new Event('authChange'));
//     }
//     return res;
//   },
// };

// export default authService;


import { apiClient } from './apiClient';

export interface RegisterDTO {
  username?: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
}

export const authService = {
  // 1. Gửi thông tin đăng ký sang backend
  register: async (payload: RegisterDTO) => {
    return await apiClient.post('/auth/register', payload);
  },

  // 2. Đăng nhập lấy Token và lưu thông tin User
  login: async (credentials: { email: string; password: string }) => {
    const res: any = await apiClient.post('/auth/login', credentials);
    
    // Tùy theo cấu trúc trả về của API, có thể là res.token, res.data.token...
    const token = res.token || res.accessToken || res.data?.token;
    const user = res.user || res.data?.user;

    if (token) {
      // Lưu token xác thực
      localStorage.setItem('access_token', token);
      
      // Lưu thông tin cá nhân để dùng cho các Form (như trang Thanh toán)
      localStorage.setItem('userName', user?.full_name || user?.username || credentials.email.split('@')[0]);
      localStorage.setItem('userEmail', user?.email || credentials.email);
      localStorage.setItem('userPhone', user?.phone || '');
      
      // Phát sự kiện để Header cập nhật trạng thái Đã đăng nhập
      window.dispatchEvent(new Event('authChange'));
      
      // Phát sự kiện để Hook useCart đổi sang giỏ hàng của tài khoản này
      window.dispatchEvent(new Event('cartChange')); 
    }
    
    return res;
  },

  // 3. Đăng xuất và xóa toàn bộ dữ liệu phiên
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    
    // Báo cho các Component cập nhật lại UI (Đăng xuất & Về giỏ hàng khách)
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('cartChange'));
  }
};

export default authService;