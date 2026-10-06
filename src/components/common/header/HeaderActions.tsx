import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, LogOut, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { useClickOutside } from '../../../hooks/useClickOutside';

interface HeaderActionsProps {
  cartCount: number;
  userName: string | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  cartCount,
  userName,
  onOpenLogin,
  onLogout,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setShowMenu(false));

  return (
    <div className="flex items-center gap-3 shrink-0">
      {/* Giỏ hàng */}
      <Link to="/cart">
        <Button variant="ghost" size="icon" className="relative hover:text-[#b8955a] rounded-full">
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="absolute top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#b8955a] text-[10px] font-bold text-black shadow-md">
              {cartCount}
            </span>
          )}
        </Button>
      </Link>

      <div className="h-4 w-[1px] bg-zinc-700" />

      {/* Profile hoặc Nút Đăng nhập */}
      {userName ? (
        <div ref={menuRef} className="relative flex items-center">
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-2 rounded-full p-1 pl-2.5 bg-zinc-800/80 border border-zinc-700 hover:border-[#b8955a] transition"
          >
            <span className="hidden sm:inline text-xs text-zinc-200">{userName}</span>
            <div className="h-6 w-6 rounded-full bg-[#b8955a] text-black font-bold flex items-center justify-center text-[10px]">
              {userName.slice(0, 1).toUpperCase()}
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 w-44 rounded-xl bg-[#17171a] border border-[#2d2d32] shadow-2xl py-1.5 z-50 text-xs">
              <a
                href="#profile"
                className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:bg-[#25252b] hover:text-white transition-colors"
              >
                <FileText className="h-3.5 w-3.5" /> Hồ sơ đại lý
              </a>
              <div className="my-1 border-t border-[#2d2d32]" />
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-[#25252b] transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenLogin}
          className="gap-2 rounded-full border-[#b8955a]/60 text-[#b8955a] hover:bg-[#b8955a] hover:text-black transition"
        >
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Đăng nhập</span>
        </Button>
      )}
    </div>
  );
};