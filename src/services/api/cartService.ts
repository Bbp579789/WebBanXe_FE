import { apiClient } from "./apiClient";

export interface CartItem {
  id?: number;
  vehicle_id?: number;
  vehicleId?: number;
  brand?: string;
  model?: string;
  image_url?: string | null;
  quantity?: number;
  price?: number | string;
  [key: string]: unknown;
}

export interface CartResponse {
  id?: number;
  user_id?: number;
  cartDetails?: CartItem[];
  items?: CartItem[];
  cartItems?: CartItem[];
  [key: string]: unknown;
}

export const cartService = {
  // Lấy giỏ hàng của người dùng hiện tại
  getCart: async (): Promise<CartResponse | CartItem[]> => {
    const response = await apiClient.get("/carts/me");
    return response.data;
  },

   getCartItems: async (): Promise<CartItem[]> => {
    const response = await apiClient.get("/carts/me");
    const data = response.data;

    if (Array.isArray(data)) return data;

    return data?.cartDetails ?? data?.items ?? data?.cartItems ?? [];
  },

  // Thêm xe vào giỏ hàng của người dùng hiện tại (Dùng /carts/add-vehicles/me)
  addToCart: async (vehicleId: number, quantity: number = 1, price?: number) => {
    try {
      const response = await apiClient.post("/carts/add-vehicles/me", {
        vehicle_id: vehicleId,
        quantity: quantity,
        price: price,
      });

      console.log("Thêm xe thành công:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Lỗi thêm xe:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });

      throw error;
    }
  },

  // Cập nhật giỏ hàng theo ID
  updateCartItem: async (
    cartId: number,
    cartData: Record<string, unknown>
  ) => {
    const response = await apiClient.put(`/carts/${cartId}`, cartData);
    return response.data;
  },

  // Xóa xe khỏi giỏ hàng của người dùng hiện tại
  removeFromCart: async (vehicleId: number) => {
    const response = await apiClient.delete("/carts/remove-vehicle/me", {
      data: {
        vehicle_id: vehicleId,
      },
    });

    return response.data;
  },
};