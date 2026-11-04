// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Icon } from '../../ui/icon';
// import { cartService } from '../../../services/api/cartService';

// export interface HeaderCartProps {
//     cartCount?: number;
//     userName?: string | null;
//     onRequireLogin: () => void;
// }

// export const HeaderCart: React.FC<HeaderCartProps> = ({
//     cartCount: propCartCount = 0,
//     userName,
//     onRequireLogin,
// }) => {
//     const navigate = useNavigate();
//     const [totalCount, setTotalCount] = useState<number>(propCartCount);

//     // Tự động lắng nghe sự kiện thay đổi giỏ hàng để cập nhật badge real-time
//     useEffect(() => {
//         const updateCartCount = () => {
//             const items = cartService.getCartItems();
//             const count = items.reduce((sum, item) => sum + item.quantity, 0);
//             setTotalCount(count > 0 ? count : propCartCount);
//         };

//         updateCartCount();
//         window.addEventListener('cartChange', updateCartCount);
//         return () => {
//             window.removeEventListener('cartChange', updateCartCount);
//         };
//     }, [propCartCount]);

//    const handleCartClick = () => {
//         const activeUser = userName || localStorage.getItem('userName');
        
//         console.log("Kiểm tra đăng nhập khi bấm Cart:", { userName, activeUser });

//         if (!activeUser) {
//             console.warn("Chưa đăng nhập -> Bật popup đăng nhập");
//             onRequireLogin();
//             return;
//         }

//         console.log("Đã đăng nhập -> Tiến hành chuyển hướng sang /cart");
//         navigate('/cart');
//     };

//     return (
//         <button
//             type="button"
//             onClick={handleCartClick}
//             className="relative p-2 text-inherit hover:text-[#b8955a] transition cursor-pointer"
//             title="Giỏ hàng"
//             aria-label="Giỏ hàng"
//         >
//             <Icon name="cart" className="size-5" />

//             {totalCount > 0 && (
//                 <span className="absolute top-1 right-1 size-4 bg-[#b8955a] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
//                     {totalCount > 99 ? '99+' : totalCount}
//                 </span>
//             )}
//         </button>
//     );
// };

// export default HeaderCart;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../ui/icon";
import { cartService } from "../../../services/api/user/cartService";
import type { CartItem, CartResponse } from "../../../services/api/user/cartService";

export interface HeaderCartProps {
  cartCount?: number;
  userName?: string | null;
  onRequireLogin: () => void;
}

export const HeaderCart: React.FC<HeaderCartProps> = ({
  cartCount: propCartCount = 0,
  userName,
  onRequireLogin,
}) => {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState<number>(propCartCount);

  useEffect(() => {
    let active = true;

    const updateCartCount = async () => {
      const activeUser = userName || localStorage.getItem("userName");

      if (!activeUser) {
        if (active) {
          setTotalCount(0);
        }
        return;
      }

      try {
        const data = await cartService.getCart();

        let items: CartItem[] = [];

        if (Array.isArray(data)) {
          items = data;
        } else {
          const response = data as CartResponse;

          if (Array.isArray(response.items)) {
            items = response.items;
          } else if (Array.isArray(response.cartItems)) {
            items = response.cartItems;
          }
        }

        const count = items.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        );

        if (active) {
          setTotalCount(count);
        }
      } catch (err) {
        console.error("Không thể tải số lượng giỏ hàng:", err);

        if (active) {
          setTotalCount(propCartCount);
        }
      }
    };

    void updateCartCount();

    window.addEventListener("cartChange", updateCartCount);
    window.addEventListener("authChange", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      active = false;
      window.removeEventListener("cartChange", updateCartCount);
      window.removeEventListener("authChange", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, [propCartCount, userName]);

  const handleCartClick = () => {
    const activeUser = userName || localStorage.getItem("userName");

    if (!activeUser) {
      onRequireLogin();
      return;
    }

    navigate("/cart");
  };

  return (
    <button
      type="button"
      onClick={handleCartClick}
      className="relative cursor-pointer p-2 text-inherit transition hover:text-[#b8955a]"
      title="Giỏ hàng"
      aria-label="Giỏ hàng"
    >
      <Icon name="cart" className="size-5" />

      {totalCount > 0 && (
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#b8955a] text-[10px] font-bold text-black shadow-xs">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </button>
  );
};

export default HeaderCart;
