import React from 'react';
import { Sheet } from '../../ui/sheet';
import type { CategorySheetProps } from '../../../types/header.types';
import { useNavigate } from 'react-router-dom';

export const CategorySheet: React.FC<CategorySheetProps> = ({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
}) => {
  const navigate = useNavigate();

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col select-none">

        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2.5 py-2 px-4 border border-zinc-200 text-[11px] font-semibold tracking-[0.18em] text-zinc-800 hover:border-zinc-800 hover:bg-zinc-50 transition-all uppercase cursor-pointer"
        >
          <span className="text-xs">✕</span>
          <span>ĐÓNG / CLOSE</span>
        </button>

        {/* Tiêu đề */}
        <div className="mt-8 mb-5">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase font-sans">
            COLLECTIONS
          </span>
        </div>

        {/* Chỉ giữ lại tất cả dòng xe */}
        <nav>
          <button
            type="button"
            onClick={() => {
              onSelectCategory(null);
              onClose();
              navigate('/vehicles');
            }}
            className="flex items-center justify-between text-left group transition-all duration-300 cursor-pointer w-full"
          >
            <span
              className={`inline-block font-['Be_Vietnam_Pro'] text-[18px] sm:text-[19px] leading-relaxed text-[#b8955a] font-medium transition-all duration-300 group-hover:translate-x-2 group-hover:scale-[1.04] group-hover:font-semibold ${
  activeCategory === null
    ? 'text-[#b8955a] font-medium'
    : 'text-zinc-800 group-hover:text-[#b8955a]'
}`}
            >
              Bộ sưu tập của chúng tôi 
            </span>

            <span className="h-2.5 w-2.5 rounded-full bg-[#b8955a] shrink-0" />
          </button>
        </nav>

        <div className="w-full h-[1px] bg-zinc-100 my-6" />

{/* Footer thương hiệu */}
<div className="mt-auto w-full flex items-center justify-center pt-6 pb-2">
  <p className="font-['Be_Vietnam_Pro'] text-[10px] font-medium tracking-[0.28em] text-[#b8955a] uppercase text-center">
    — MERCEDES-BENZ COLLECTION —
  </p>
</div>

      </div>
    </Sheet>
  );
};

export default CategorySheet;