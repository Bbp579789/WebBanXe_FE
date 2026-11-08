// import { apiClient } from "./apiClient";

// export interface CartItem {
//   id?: number;
//   vehicle_id?: number;
//   vehicleId?: number;
//   brand?: string;
//   model?: string;
//   image_url?: string | null;
//   quantity?: number;
//   price?: number | string;
//   [key: string]: unknown;
// }

// export interface CartResponse {
//   id?: number;
//   user_id?: number;
//   cartDetails?: CartItem[];
//   items?: CartItem[];
//   cartItems?: CartItem[];
//   [key: string]: unknown;
// }

// export const cartService = {
//   // Lấy giỏ hàng của người dùng hiện tại
//   getCart: async (): Promise<CartResponse | CartItem[]> => {
//     const response = await apiClient.get("/carts/me");
//     return response as unknown as CartResponse | CartItem[];
//   },

//    getCartItems: async (): Promise<CartItem[]> => {
//     const response = await apiClient.get("/carts/me");
//     const data = response as unknown as
//       | CartResponse
//       | CartItem[];

//     if (Array.isArray(data)) return data;

//     return data?.cartDetails ?? data?.items ?? data?.cartItems ?? [];
//   },

//   // Thêm xe vào giỏ hàng của người dùng hiện tại (Dùng /carts/add-vehicles/me)
//   addToCart: async (vehicleId: number, quantity: number = 1, price?: number) => {
//     try {
//       const response = await apiClient.post("/carts/add-vehicles/me", {
//         vehicle_id: vehicleId,
//         quantity: quantity,
//         price: price,
//       });

//       console.log("Thêm xe thành công:", response);
//       return response as unknown as CartResponse;
//     } catch (error: any) {
//       console.error("Lỗi thêm xe:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         url: error.config?.url,
//         baseURL: error.config?.baseURL,
//       });

//       throw error;
//     }
//   },

//   // Cập nhật giỏ hàng theo ID
//   updateCartItem: async (
//     cartId: number,
//     cartData: Record<string, unknown>
//   ) => {
//     const response = await apiClient.put(`/carts/${cartId}`, cartData);
//     return response as unknown as CartResponse;
//   },

//   // Xóa xe khỏi giỏ hàng của người dùng hiện tại
//   removeFromCart: async (vehicleId: number) => {
//     const response = await apiClient.delete("/carts/remove-vehicle/me", {
//       data: {
//         vehicle_id: vehicleId,
//       },
//     });

//     return response as unknown as CartResponse;
//   },
// };


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
  created_at?: string;
  updated_at?: string;
  cartDetails?: CartItem[];
  items?: CartItem[];
  cartItems?: CartItem[];
  [key: string]: unknown;
}

// Chuẩn hóa response từ apiClient
const extractCartData = (response: any): CartResponse => {
  // apiClient đã trả về response.data
  // Hỗ trợ cả trường hợp Backend trả { message, status, data }
  const data = response?.data ?? response;

  if (!data || typeof data !== "object") {
    return { cartDetails: [] };
  }

  return data;
};

const extractCartItems = (response: any): CartItem[] => {
  const data = extractCartData(response);

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(data.cartDetails)) {
    return data.cartDetails;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.cartItems)) {
    return data.cartItems;
  }

  return [];
};

export const cartService = {
  // Lấy giỏ hàng của người dùng hiện tại
  getCart: async (): Promise<CartResponse> => {
    const response = await apiClient.get("/carts/me");

    return extractCartData(response);
  },

  // Lấy danh sách sản phẩm trong giỏ hàng
  getCartItems: async (): Promise<CartItem[]> => {
    const response = await apiClient.get("/carts/me");

    return extractCartItems(response);
  },

  // Thêm xe vào giỏ hàng
  addToCart: async (
    vehicleId: number,
    quantity: number = 1,
    price?: number
  ) => {
    const response = await apiClient.post("/carts/add-vehicles/me", {
      vehicle_id: vehicleId,
      quantity,
      ...(price !== undefined ? { price } : {}),
    });

    return response;
  },

  // Cập nhật giỏ hàng theo ID
  updateCartItem: async (
    cartId: number,
    cartData: Record<string, unknown>
  ) => {
    const response = await apiClient.put(
      `/carts/${cartId}`,
      cartData
    );

    return response;
  },

  // Xóa xe khỏi giỏ hàng
  removeFromCart: async (vehicleId: number) => {
    const response = await apiClient.delete(
      "/carts/remove-vehicle/me",
      {
        data: {
          vehicle_id: vehicleId,
        },
      }
    );

    return response;
  },
};
