// import type { Vehicle } from '../../types';

// export interface CartItem {
//   car: Vehicle;
//   quantity: number;
// }

// const CART_STORAGE_KEY = 'valoir_cart_items';

// export const cartService = {
//   getCartItems: (): CartItem[] => {
//     try {
//       const data = localStorage.getItem(CART_STORAGE_KEY);
//       return data ? JSON.parse(data) : [];
//     } catch (error) {
//       console.error('Lỗi đọc giỏ hàng:', error);
//       return [];
//     }
//   },

//   // THÊM ĐIỀU KIỆN KIỂM TRA AN TOÀN CHO car
//   addToCart: (car: Vehicle, quantity: number = 1) => {
//     if (!car) {
//       console.warn('Không thể thêm vào giỏ hàng vì dữ liệu xe đang trống!');
//       return;
//     }

//     const currentItems = cartService.getCartItems();
//     const carId = car.id || (car as any)._id || (car as any).vehicle_id;
    
//     const existingIndex = currentItems.findIndex((item) => {
//       const itemId = item?.car?.id || (item?.car as any)?._id || (item?.car as any)?.vehicle_id;
//       return itemId === carId;
//     });

//     if (existingIndex > -1) {
//       currentItems[existingIndex].quantity += quantity;
//     } else {
//       currentItems.push({ car, quantity });
//     }

//     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));
//     window.dispatchEvent(new Event('cartChange'));
//   },

//   removeFromCart: (carId: number) => {
//     const currentItems = cartService.getCartItems();
//     const updatedItems = currentItems.filter((item) => {
//       const itemId = item?.car?.id || (item?.car as any)?._id || (item?.car as any)?.vehicle_id;
//       return itemId !== carId;
//     });
//     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
//     window.dispatchEvent(new Event('cartChange'));
//   },

//   clearCart: () => {
//     localStorage.removeItem(CART_STORAGE_KEY);
//     window.dispatchEvent(new Event('cartChange'));
//   },
// };

// src/services/api/cartService.ts
export const cartService = {
  // Lấy khóa (key) lưu trữ giỏ hàng dựa trên người dùng hiện tại
  getCartKey: () => {
    const userName = localStorage.getItem('userName');
    // Nếu đã đăng nhập -> Dùng giỏ hàng riêng của user đó. 
    // Nếu chưa đăng nhập -> Dùng giỏ hàng khách (guest).
    return userName ? `valoir_cart_${userName}` : 'valoir_cart_guest';
  },

  getCartItems: () => {
    const key = cartService.getCartKey();
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  },

  addToCart: (vehicle: any, quantity: number = 1) => {
    const key = cartService.getCartKey();
    const items = cartService.getCartItems();
    
    // Hỗ trợ cả 2 định dạng cũ (item.car) và chuẩn (item.vehicle)
    const existingIndex = items.findIndex((item: any) => {
      const targetVehicle = item?.vehicle || item?.car || item;
      return targetVehicle?.id === vehicle.id;
    });
    
    if (existingIndex > -1) {
      items[existingIndex].quantity = (items[existingIndex].quantity || 1) + quantity;
    } else {
      items.push({ 
        id: Date.now(), 
        cart_id: 1,
        vehicle_id: vehicle.id,
        vehicle: vehicle, 
        quantity: quantity 
      });
    }
    
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event('cartChange'));
  },

  removeFromCart: (vehicleId: number) => {
    const key = cartService.getCartKey();
    const items = cartService.getCartItems();
    
    const newItems = items.filter((item: any) => {
      const targetVehicle = item?.vehicle || item?.car || item;
      return targetVehicle?.id !== vehicleId;
    });
    
    localStorage.setItem(key, JSON.stringify(newItems));
    window.dispatchEvent(new Event('cartChange'));
  },

  clearCart: () => {
    const key = cartService.getCartKey();
    localStorage.removeItem(key);
    window.dispatchEvent(new Event('cartChange'));
  }
};