// import { useState, useEffect, useCallback } from 'react';
// import { cartService } from '../services/api/cartService';
// import type { CartItem, Vehicle } from '../types';

// export const useCart = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const loadCart = useCallback(() => {
//     try {
//       const rawItems = cartService.getCartItems() as any[];
//       const formattedItems: CartItem[] = (Array.isArray(rawItems) ? rawItems : []).map((item, index) => {
//         const vehicleObj = item?.vehicle || item?.car || item;
//         return {
//           id: item?.id || vehicleObj?.id || index + 1,
//           cart_id: item?.cart_id || 1,
//           vehicle_id: vehicleObj?.id || 0,
//           quantity: Number(item?.quantity) || 1,
//           vehicle: vehicleObj as Vehicle,
//         };
//       });
//       setCartItems(formattedItems);
//     } catch (error) {
//       console.error('Lỗi tải giỏ hàng:', error);
//       setCartItems([]);
//     }
//   }, []);

//   useEffect(() => {
//     loadCart();
//     window.addEventListener('cartChange', loadCart);
//     return () => {
//       window.removeEventListener('cartChange', loadCart);
//     };
//   }, [loadCart]);

//   const handleUpdateQuantity = (vehicle: Vehicle, delta: number) => {
//     const rawItems = cartService.getCartItems() as any[];
//     const vehicleId = vehicle.id;

//     const existingIndex = rawItems.findIndex((item) => {
//       const targetVehicle = item?.vehicle || item?.car || item;
//       return targetVehicle?.id === vehicleId;
//     });

//     if (existingIndex > -1) {
//       const newQty = (rawItems[existingIndex].quantity || 1) + delta;
//       if (newQty <= 0) {
//         cartService.removeFromCart(vehicleId);
//       } else {
//         rawItems[existingIndex].quantity = newQty;
//         localStorage.setItem('valoir_cart_items', JSON.stringify(rawItems));
//         window.dispatchEvent(new Event('cartChange'));
//       }
//     }
//   };

//   const handleRemove = (vehicleId: number) => {
//     cartService.removeFromCart(vehicleId);
//   };

//   const subtotal = cartItems.reduce((sum, item) => {
//     const vehicle = item?.vehicle;
//     const price = Number(vehicle?.price) || 0;
//     const quantity = Number(item?.quantity) || 1;
//     return sum + price * quantity;
//   }, 0);

//   return {
//     cartItems,
//     subtotal,
//     handleUpdateQuantity,
//     handleRemove,
//   };
// };


// src/hooks/useCart.ts
import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/api/cartService';
import type { CartItem, Vehicle } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(() => {
    try {
      const rawItems = cartService.getCartItems() as any[];
      const formattedItems: CartItem[] = (Array.isArray(rawItems) ? rawItems : []).map((item, index) => {
        const vehicleObj = item?.vehicle || item?.car || item;
        return {
          id: item?.id || vehicleObj?.id || index + 1,
          cart_id: item?.cart_id || 1,
          vehicle_id: vehicleObj?.id || 0,
          quantity: Number(item?.quantity) || 1,
          vehicle: vehicleObj as Vehicle,
        };
      });
      setCartItems(formattedItems);
    } catch (error) {
      console.error('Lỗi tải giỏ hàng:', error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    // Tải giỏ hàng lần đầu
    loadCart();

    // Lắng nghe khi có thay đổi thêm/xóa sản phẩm
    window.addEventListener('cartChange', loadCart);
    
    // ĐIỂM MẤU CHỐT: Lắng nghe khi người dùng Đăng nhập / Đăng xuất
    window.addEventListener('authChange', loadCart);

    return () => {
      window.removeEventListener('cartChange', loadCart);
      window.removeEventListener('authChange', loadCart);
    };
  }, [loadCart]);

  const handleUpdateQuantity = (vehicle: Vehicle, delta: number) => {
    const rawItems = cartService.getCartItems() as any[];
    const vehicleId = vehicle.id;

    const existingIndex = rawItems.findIndex((item) => {
      const targetVehicle = item?.vehicle || item?.car || item;
      return targetVehicle?.id === vehicleId;
    });

    if (existingIndex > -1) {
      const newQty = (rawItems[existingIndex].quantity || 1) + delta;
      if (newQty <= 0) {
        cartService.removeFromCart(vehicleId);
      } else {
        rawItems[existingIndex].quantity = newQty;
        // Lấy đúng key của user hiện tại để lưu
        const currentKey = cartService.getCartKey();
        localStorage.setItem(currentKey, JSON.stringify(rawItems));
        window.dispatchEvent(new Event('cartChange'));
      }
    }
  };

  const handleRemove = (vehicleId: number) => {
    cartService.removeFromCart(vehicleId);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const vehicle = item?.vehicle;
    const price = Number(vehicle?.price) || 0;
    const quantity = Number(item?.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  return {
    cartItems,
    subtotal,
    handleUpdateQuantity,
    handleRemove,
  };
};