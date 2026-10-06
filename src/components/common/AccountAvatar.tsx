import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/icon';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface AccountAvatarProps {
  userName?: string | null;
  avatarUrl?: string;
  onOpenLogin?: () => void; 
  onLogout?: () => void;
}

export function AccountAvatar({
  userName,
  avatarUrl,
  onOpenLogin,
  onLogout,
}: AccountAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  // Nếu chưa đăng nhập, hiển thị nút Đăng nhập
  if (!userName) {
    return (
      <button
        type="button"
        onClick={onOpenLogin}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#b8955a]/60 text-[#b8955a] hover:bg-[#b8955a] hover:text-black transition text-xs font-medium"
      >
        <Icon name="user" className="size-3.5" />
        <span className="hidden sm:inline">Đăng nhập</span>
      </button>
    );
  }

  // Lấy chữ cái đầu làm Avatar đại diện
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-[#b8955a]/60 transition"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <div className="size-7 rounded-full bg-[#b8955a] text-black text-xs font-bold font-mono flex items-center justify-center">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline text-xs font-medium text-zinc-300 max-w-[120px] truncate">
          {userName}
        </span>
      </button>

      {/* Menu dropdown khi bấm vào Avatar */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-48 rounded-xl bg-[#17171a] border border-[#2d2d32] shadow-2xl py-1.5 z-50 text-xs">
          <div className="px-3.5 py-2 border-b border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
              Tài khoản
            </p>
            <p className="text-zinc-200 font-semibold truncate">{userName}</p>
          </div>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <Icon name="user" className="size-3.5 text-[#b8955a]" /> Hồ sơ tài khoản
          </Link>

          <Link
            to="/service-booking"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <Icon name="car" className="size-3.5 text-[#b8955a]" /> Lịch hẹn lái thử
          </Link>

          <div className="my-1 border-t border-zinc-800" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:bg-zinc-800 transition text-left"
          >
            <Icon name="logout" className="size-3.5" /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}