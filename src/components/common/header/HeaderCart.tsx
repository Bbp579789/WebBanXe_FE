import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../ui/icon';
import { cartService } from '../../../services/api/cartService';

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

    // Tự động lắng nghe sự kiện thay đổi giỏ hàng để cập nhật badge real-time
    useEffect(() => {
        const updateCartCount = () => {
            const items = cartService.getCartItems();
            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            setTotalCount(count > 0 ? count : propCartCount);
        };

        updateCartCount();
        window.addEventListener('cartChange', updateCartCount);
        return () => {
            window.removeEventListener('cartChange', updateCartCount);
        };
    }, [propCartCount]);

   const handleCartClick = () => {
        const activeUser = userName || localStorage.getItem('userName');
        
        console.log("Kiểm tra đăng nhập khi bấm Cart:", { userName, activeUser });

        if (!activeUser) {
            console.warn("Chưa đăng nhập -> Bật popup đăng nhập");
            onRequireLogin();
            return;
        }

        console.log("Đã đăng nhập -> Tiến hành chuyển hướng sang /cart");
        navigate('/cart');
    };

    return (
        <button
            type="button"
            onClick={handleCartClick}
            className="relative p-2 text-inherit hover:text-[#b8955a] transition cursor-pointer"
            title="Giỏ hàng"
            aria-label="Giỏ hàng"
        >
            <Icon name="cart" className="size-5" />

            {totalCount > 0 && (
                <span className="absolute top-1 right-1 size-4 bg-[#b8955a] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {totalCount > 99 ? '99+' : totalCount}
                </span>
            )}
        </button>
    );
};

export default HeaderCart;