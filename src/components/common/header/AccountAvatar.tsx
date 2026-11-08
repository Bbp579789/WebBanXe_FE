import React, { useState } from 'react';
import { Icon } from '../../ui/icon';
import type { AccountAvatarProps } from '../../../types/header.types';
import { Link, useNavigate } from 'react-router-dom';

export const AccountAvatar: React.FC<AccountAvatarProps> = ({
  userName,
  avatarUrl,
  onOpenLogin,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(false);
    try {
      await onLogout?.();
      setIsOpen(false);
      navigate('/');
    } catch {
      setLogoutError(true);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!userName) {
    return (
      <button
        type="button"
        onClick={() => onOpenLogin?.()}
        className="relative p-2 text-inherit hover:text-[#b8955a] transition cursor-pointer"
      >
        <Icon name="avatar" className="size-5" />

      </button>
    );
  }

  const initials = userName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      {/* AVATAR */}
      <button
        type="button"
        onClick={() => {
          console.log('CLICK AVATAR');
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 p-1 pr-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-[#b8955a] transition cursor-pointer"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <div className="size-7 rounded-full bg-[#b8955a] text-black text-xs font-bold flex items-center justify-center">
            {initials}
          </div>
        )}

        <span className="hidden sm:inline text-xs font-medium text-zinc-200 max-w-[120px] truncate">
          {userName}
        </span>

        <span className="text-white text-xs">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+8px)]
            w-64
            bg-[#141416]
            border-2
            border-[#b8955a]
            rounded-2xl
            shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            z-[9999]
            overflow-hidden
          "
        >
          {/* USER */}
          <div className="px-4 py-4 border-b border-zinc-700">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Tài khoản thượng khách
            </p>

            <p className="text-white font-semibold text-sm mt-1">
              {userName}
            </p>
          </div>

         

          {/* ORDER */}
          <Link
            to="/order"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <Icon name="order" className="size-4 text-[#b8955a]" />
            <span>Đơn hàng</span>
          </Link>

          {/* DIVIDER */}
          <div className="border-t border-zinc-800" />

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 text-left disabled:opacity-70"
          >
            <Icon
              name="logout"
              className="size-4"
            />

            <span>{isLoggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}</span>
          </button>
          {logoutError && (
            <p role="alert" className="px-4 pb-3 text-xs text-rose-400">
              Chưa thể đăng xuất. Vui lòng thử lại.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountAvatar;
