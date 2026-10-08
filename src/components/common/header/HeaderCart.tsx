import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../ui/icon';

export interface HeaderCartProps {
    cartCount?: number;
    userName?: string | null;
    onRequireLogin: () => void;
}

export const HeaderCart: React.FC<HeaderCartProps> = ({
    cartCount = 0,
    userName,
    onRequireLogin,
}) => {
    const navigate = useNavigate();

    const handleCartClick = () => {
        if (!userName) {
            onRequireLogin();
            return;
        }
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

            {cartCount > 0 && (
                <span className="absolute top-1 right-1 size-4 bg-[#b8955a] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </button>
    );
};

export default HeaderCart;