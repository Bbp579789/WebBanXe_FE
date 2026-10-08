import React from 'react';
import { Sheet } from '../../ui/sheet';
import type { CategoryItem, CategorySheetProps } from '../../../types/header.types';
import { useNavigate } from 'react-router-dom';

const CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Sedan Hạng Sang', count: '12' },
  { id: 2, name: 'SUV Hiệu Năng Cao', count: '8' },
  { id: 3, name: 'Coupe & Grand Tourer', count: '5' },
  { id: 4, name: 'Xe Điện & Hybrid', count: '6' },
  { id: 5, name: 'Bộ Sưu Tập Giới Hạn', tag: 'BESPOKE' },
];


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
        <div>
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 py-2 px-4 border border-zinc-200 text-[11px] font-semibold tracking-[0.18em] text-zinc-800 hover:border-zinc-800 hover:bg-zinc-50 transition-all uppercase cursor-pointer"
          >
            <span className="text-xs">✕</span>
            <span>ĐÓNG / CLOSE</span>
          </button>
        </div>

        <div className="mt-8 mb-5">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase font-sans">
            COLLECTIONS
          </span>
        </div>

        <nav className="flex flex-col space-y-5">
          <button
            type="button"
            onClick={() => {
              onSelectCategory(null);
              onClose();
              navigate('/vehicles');
            }}
            className="flex items-center justify-between text-left group transition-colors cursor-pointer w-full"
          >
            <span
              className={`font-serif text-[18px] sm:text-[19px] leading-tight transition-colors ${activeCategory === null
                ? 'text-[#b8955a] font-normal'
                : 'text-zinc-800 group-hover:text-[#b8955a]'
                }`}
            >
              Tất cả dòng xe
            </span>

            {activeCategory === null ? (
              <span className="h-2 w-2 rounded-full bg-[#b8955a] shrink-0" />
            ) : (
              <span className="text-xs font-sans text-zinc-400 font-normal">31</span>
            )}
          </button>

          {CATEGORIES.map((c) => {
            const isSelected = activeCategory === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectCategory(c.id);
                  onClose();
                }}
                className="flex items-center justify-between text-left group transition-colors cursor-pointer"
              >
                <span
                  className={`font-serif text-[18px] sm:text-[19px] leading-tight transition-colors ${isSelected
                    ? 'text-[#b8955a] font-normal'
                    : 'text-zinc-800 group-hover:text-[#b8955a]'
                    }`}
                >
                  {c.name}
                </span>

                {isSelected ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#b8955a] shrink-0" />
                ) : c.tag ? (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#fbf6ec] border border-[#f0e3cc] text-[9px] font-sans font-bold tracking-wider text-[#b8955a] uppercase">
                    {c.tag}
                  </span>
                ) : (
                  <span className="text-xs font-sans text-zinc-400 font-normal">
                    {c.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="w-full h-[1px] bg-zinc-100 my-6" />

        <a
          href="#service"
          onClick={onClose}
          className="text-[12px] text-zinc-600 hover:text-[#b8955a] leading-relaxed transition-colors font-sans"
        >
          Đặt lịch bảo dưỡng (Service & Maintenance)
        </a>
      </div>
    </Sheet>
  );
};