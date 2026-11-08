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
import { cartService, getCartErrorMessage } from '../services/api/user/cartService';
import type { CartItem, Vehicle } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartError, setCartError] = useState('');

  const loadCart = useCallback(async () => {
    try {
      // Chưa đăng nhập thì giỏ rỗng, không gọi API
      const isLoggedIn = Boolean(localStorage.getItem('access_token'));
      const vehicles = await (isLoggedIn ? cartService.getCartItems() : Promise.resolve([]));

      // Mỗi phần tử backend trả về là thông tin một chiếc xe
      const formattedItems: CartItem[] = vehicles.map((item) => {
        const vehicle = item as unknown as Vehicle;
        return {
          id: Number(vehicle.id),
          cart_id: 0,
          vehicle_id: Number(vehicle.id),
          quantity: 1,
          vehicle: vehicle,
        };
      });

      setCartItems(formattedItems);
      setCartError('');
    } catch (error) {
      console.error('Lỗi tải giỏ hàng:', error);
      setCartItems([]);
      setCartError(getCartErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    void loadCart();

    const handleCartChange = () => {
      void loadCart();
    };

    window.addEventListener('cartChange', handleCartChange);
    window.addEventListener('authChange', handleCartChange);

    return () => {
      window.removeEventListener('cartChange', handleCartChange);
      window.removeEventListener('authChange', handleCartChange);
    };
  }, [loadCart]);

  // Mỗi xe là một chiếc riêng (số lượng luôn là 1): giảm số lượng nghĩa là bỏ xe khỏi giỏ
  const handleUpdateQuantity = async (vehicle: Vehicle, delta: number) => {
    if (delta < 0) {
      await handleRemove(vehicle.id);
    }
  };

  const handleRemove = async (vehicleId: number) => {
    try {
      await cartService.removeFromCart(vehicleId);
      window.dispatchEvent(new Event('cartChange'));
    } catch (error) {
      console.error('Lỗi xóa xe khỏi giỏ hàng:', error);
      alert(getCartErrorMessage(error));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (Number(item?.vehicle?.price) || 0);
  }, 0);

  return {
    cartItems,
    subtotal,
    cartError,
    handleUpdateQuantity,
    handleRemove,
    loadCart,
  };
};
