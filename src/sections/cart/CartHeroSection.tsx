import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const CartHeroSection: React.FC = () => {
  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pt-4">
      {/* Breadcrumb điều hướng */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-6">
        <Link to="/" className="flex items-center gap-1 hover:text-zinc-950 transition">
          <Home className="size-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-[#b8955a] font-medium">Giỏ hàng độc bản</span>
      </nav>

      <div className="border-b border-zinc-200/80 pb-6 mb-10">
        <span className="text-[11px] font-mono tracking-[0.25em] text-[#b8955a] uppercase font-bold">
          VALOIR ATELIER CHECKOUT
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mt-1">
          Giỏ Hàng & Cấu Hình Đặt Cọc Xe
        </h1>
      </div>
    </div>
  );
};