import React, { useState, useEffect } from 'react';
import { Icon } from '../ui/icon';
import { AccountAvatar } from './header/AccountAvatar';
import { HeaderCart } from './header/HeaderCart';
import { HeaderSearch } from './header/HeaderSearch';
import { CategorySheet } from './header/CategorySheet';
import { LoginDialog } from './header/LoginDialog';
import { useScrollThreshold } from '../../hooks/useScrollThreshold';
import type { HeaderProps } from '../../types/header.types';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC<HeaderProps> = ({ cartCount = 0, onSearch }) => {
  const navigate = useNavigate();
  const isSolid = useScrollThreshold(20);
  const [isHovered, setIsHovered] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // 1. Khởi tạo userName từ localStorage (tránh bị mất khi reload hoặc đăng nhập từ trang khác)
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('userName');
  });

  // 2. Lắng nghe sự kiện đăng nhập / đăng xuất từ các trang hoặc component khác
  useEffect(() => {
    const handleSyncAuth = () => {
      setUserName(localStorage.getItem('userName'));
    };

    // Bắt sự kiện tùy biến giữa các component trong cùng 1 tab
    window.addEventListener('authChange', handleSyncAuth);
    // Bắt sự kiện thay đổi localStorage giữa các tab trình duyệt
    window.addEventListener('storage', handleSyncAuth);

    return () => {
      window.removeEventListener('authChange', handleSyncAuth);
      window.removeEventListener('storage', handleSyncAuth);
    };
  }, []);

  // 3. Xử lý khi đăng nhập thành công ngay tại Header
  const handleLoginSuccess = (name: string) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    setIsLoginOpen(false);
    window.dispatchEvent(new Event('authChange'));
  };

  // 4. Xử lý khi đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName(null);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const active = isSolid || isHovered;

  return (
    <>
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 inset-x-0 h-16 px-6 z-50 flex items-center justify-between overflow-visible transition-all select-none ${active
            ? 'bg-white/95 text-zinc-900 border-b border-zinc-200 shadow-sm backdrop-blur-md'
            : 'bg-transparent text-white border-b border-transparent'
          }`}
      >
        {/* Menu & Thanh tìm kiếm */}
        <div className="flex items-center gap-3 flex-1 max-w-xs sm:max-w-sm">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 rounded-full hover:bg-zinc-500/10 transition cursor-pointer"
            title="Danh mục xe"
          >
            <Icon name="menu" className="size-5" />
          </button>
          <HeaderSearch isSolid={active} onSearch={onSearch} />
        </div>

        {/* Logo & Nhãn thương hiệu */}
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer"
          title="Quay về trang chủ"
        >
          <div className="size-8 rounded-full border border-[#b8955a] p-1 text-[#b8955a]">
            <Icon name="logo" className="size-full" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-sm font-semibold tracking-[0.2em] font-serif uppercase">
              MERCEDES-BENZ
            </span>
            <span className="text-[9px] tracking-[0.18em] text-[#b8955a] uppercase font-mono mt-1 font-medium">
              Authorized Dealer Portal
            </span>
          </div>
        </Link>

        {/* Giỏ hàng & Avatar cá nhân */}
        <div className="flex items-center justify-end gap-3 w-1/3 relative z-[9999]">
          <HeaderCart
            cartCount={cartCount}
            userName={userName}
            onRequireLogin={() => setIsLoginOpen(true)}
          />

          <AccountAvatar
            userName={userName}
            onOpenLogin={() => setIsLoginOpen(true)}
            onLogout={handleLogout}
          />
        </div>
      </header>

      {/* Sheets & Dialogs */}
      <CategorySheet
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;