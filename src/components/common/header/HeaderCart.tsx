import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../ui/icon";
import { cartService } from "../../../services/api/user/cartService";

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
        // Mỗi phần tử là một chiếc xe nên số xe chính là độ dài danh sách
        const items = await cartService.getCartItems();

        if (active) {
          setTotalCount(items.length);
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