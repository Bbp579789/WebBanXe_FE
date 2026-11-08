import axios from "axios";
import { apiClient } from "./apiClient";

// Mỗi xe trong giỏ là một chiếc cụ thể (thông tin công khai của xe), không có số lượng
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

// Lấy userId trong JWT đang lưu (dùng khi phải tạo giỏ hàng mới)
function getUserIdFromToken(): number | null {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    const userId = Number(payload.userId ?? payload.id);
    return Number.isInteger(userId) ? userId : null;
  } catch {
    return null;
  }
}

// Câu báo lỗi backend trả về (vehicle-service dùng trường error)
function getBackendMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    return data?.error || data?.message || "";
  }
  return "";
}

function isCartNotFound(error: unknown): boolean {
  return getBackendMessage(error).includes("Cart not found");
}

// Câu báo lỗi tiếng Việt cho người dùng
export function getCartErrorMessage(error: unknown): string {
  const message = getBackendMessage(error);

  if (message === "Vehicle already exists in cart") {
    return "Xe này đã có trong giỏ hàng của bạn.";
  }
  if (message === "Vehicle not found") {
    return "Xe này không còn tồn tại.";
  }
  if (message === "Vehicle not found in cart") {
    return "Xe này không còn trong giỏ hàng.";
  }
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
  }
  if (axios.isAxiosError(error) && !error.response) {
    return "Không kết nối được máy chủ, vui lòng thử lại.";
  }
  return "Không thể cập nhật giỏ hàng. Vui lòng thử lại.";
}

export function isVehicleAlreadyInCart(error: unknown): boolean {
  return getBackendMessage(error) === "Vehicle already exists in cart";
}

// Backend trả { message, status, data: { id, user_id, cartDetails: [...] } }
function readCart(response: unknown): CartResponse {
  const body = response as { data?: CartResponse } & CartResponse;
  if (body && body.data && typeof body.data === "object") {
    return body.data;
  }
  return body || {};
}

// Tài khoản tạo bằng Telegram có thể chưa có giỏ hàng: tạo mới cho người dùng hiện tại
async function createMyCart() {
  const userId = getUserIdFromToken();
  if (userId === null) {
    throw new Error("Không xác định được tài khoản để tạo giỏ hàng");
  }
  await apiClient.post("/carts", { user_id: userId });
}

export const cartService = {
  // Lấy giỏ hàng của người dùng hiện tại; chưa có giỏ thì coi như giỏ rỗng
  getCart: async (): Promise<CartResponse> => {
    try {
      const response = await apiClient.get("/carts/me");
      return readCart(response);
    } catch (error) {
      if (isCartNotFound(error)) {
        return { cartDetails: [] };
      }
      throw error;
    }
  },

  // Danh sách xe trong giỏ
  getCartItems: async (): Promise<CartItem[]> => {
    const cart = await cartService.getCart();
    const items = cart.cartDetails ?? cart.items ?? cart.cartItems ?? [];
    // Bỏ các xe đã bị xóa khỏi hệ thống (backend trả null)
    return items.filter((item) => item !== null && item !== undefined);
  },

  // Thêm xe vào giỏ; mỗi xe là một chiếc riêng nên không có số lượng
  addToCart: async (vehicleId: number) => {
    const body = { vehicle_id: vehicleId };
    try {
      return await apiClient.post("/carts/add-vehicles/me", body);
    } catch (error) {
      if (!isCartNotFound(error)) {
        throw error;
      }
      // Chưa có giỏ hàng: tạo giỏ rồi thêm lại một lần
      await createMyCart();
      return await apiClient.post("/carts/add-vehicles/me", body);
    }
  },

  // Xóa xe khỏi giỏ hàng của người dùng hiện tại
  removeFromCart: async (vehicleId: number) => {
    return await apiClient.delete("/carts/remove-vehicle/me", {
      data: { vehicle_id: vehicleId },
    });
  },
};
