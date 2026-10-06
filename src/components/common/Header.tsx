import React, { useState } from 'react';
import { Icon } from '../ui/icon';
import { AccountAvatar } from './AccountAvatar';
import { HeaderSearch } from './header/HeaderSearch';
import { CategorySheet } from './header/CategorySheet';
import { LoginDialog } from './header/LoginDialog';
import { useScrollThreshold } from '../../hooks/useScrollThreshold';
import type { HeaderProps } from '../../types/header.types';

export function Header({ cartCount = 0, onSearch }: HeaderProps) {
  const isSolid = useScrollThreshold(20);
  const [isHovered, setIsHovered] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const active = isSolid || isHovered;

  return (
    <>
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 inset-x-0 h-16 px-6 z-40 flex items-center justify-between transition-all select-none ${
          active
            ? 'bg-white/95 text-zinc-900 border-b border-zinc-200 shadow-sm backdrop-blur-md'
            : 'bg-transparent text-white border-b border-transparent'
        }`}
      >
        {/* Menu & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xs sm:max-w-sm">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 rounded-full hover:bg-zinc-500/10 transition"
            title="Danh mục xe"
          >
            <Icon name="menu" className="size-5" />
          </button>
          <HeaderSearch isSolid={active} onSearch={onSearch} />
        </div>

        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
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
        </div>

        {/* Actions & Avatar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2 text-inherit hover:text-[#b8955a] transition"
            title="Giỏ hàng"
          >
            <Icon name="cart" className="size-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 size-4 bg-[#b8955a] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <AccountAvatar
            userName={userName}
            onOpenLogin={() => setIsLoginOpen(true)}
            onLogout={() => setUserName(null)}
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
        onLoginSuccess={(name) => setUserName(name)}
      />
    </>
  );
}

export default Header;