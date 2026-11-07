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
import { cartService } from '../services/api/user/cartService';
import type { CartItem, Vehicle } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(async () => {
    try {
      const rawItems = await cartService.getCartItems();

      const formattedItems: CartItem[] = (
        Array.isArray(rawItems) ? rawItems : []
      ).map((item: any, index: number) => {
        const vehicleObj = item?.vehicle || item?.car || item;

        return {
          ...item,
          id: item?.id ?? vehicleObj?.id ?? index + 1,
          cart_id: item?.cart_id ?? 1,
          vehicle_id:
            item?.vehicle_id ?? item?.vehicleId ?? vehicleObj?.id ?? 0,
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
    void loadCart();

    const handleCartChange = () => {
      void loadCart();
    };

    const handleAuthChange = () => {
      void loadCart();
    };

    window.addEventListener('cartChange', handleCartChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('cartChange', handleCartChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [loadCart]);

  const handleUpdateQuantity = async (
    vehicle: Vehicle,
    delta: number
  ) => {
    const existingItem = cartItems.find(
      (item) => Number(item.vehicle_id) === Number(vehicle.id)
    );

    if (!existingItem) return;

    const newQuantity = Number(existingItem.quantity || 1) + delta;

    try {
      if (newQuantity <= 0) {
        await cartService.removeFromCart(vehicle.id);
      } else {
        // Chỉ cập nhật được khi backend có API cập nhật số lượng
        await cartService.updateCartItem(
          existingItem.id as number,
          { quantity: newQuantity }
        );
      }

      await loadCart();
      window.dispatchEvent(new Event('cartChange'));
    } catch (error) {
      console.error('Lỗi cập nhật giỏ hàng:', error);
    }
  };

  const handleRemove = async (vehicleId: number) => {
    try {
      await cartService.removeFromCart(vehicleId);
      await loadCart();
      window.dispatchEvent(new Event('cartChange'));
    } catch (error) {
      console.error('Lỗi xóa xe khỏi giỏ hàng:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item?.vehicle?.price) || 0;
    const quantity = Number(item?.quantity) || 1;

    return sum + price * quantity;
  }, 0);

  return {
    cartItems,
    subtotal,
    handleUpdateQuantity,
    handleRemove,
    loadCart,
  };
};
