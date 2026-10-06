import React from 'react';
import { Sheet } from '../../ui/sheet';
import type { CategoryItem } from '../../../types/header.types';

// Đặt mảng danh mục trực tiếp bên trong component này
const CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Sedan Hạng Sang', count: '12' },
  { id: 2, name: 'SUV Hiệu Năng Cao', count: '8' },
  { id: 3, name: 'Coupe & Grand Tourer', count: '5' },
  { id: 4, name: 'Xe Điện & Hybrid', count: '6' },
  { id: 5, name: 'Bộ Sưu Tập Giới Hạn', tag: 'BESPOKE' },
];

interface CategorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: number | null;
  onSelectCategory: (id: number | null) => void;
  // Cho phép truyền categories tùy chỉnh từ ngoài vào nếu muốn, mặc định dùng CATEGORIES
  categories?: CategoryItem[];
}

export const CategorySheet: React.FC<CategorySheetProps> = ({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  categories = CATEGORIES,
}) => {
  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col select-none">
        {/* Nút ĐÓNG / CLOSE */}
        <div>
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 py-2 px-4 border border-zinc-200 text-[11px] font-semibold tracking-[0.18em] text-zinc-800 hover:border-zinc-800 hover:bg-zinc-50 transition-all uppercase"
          >
            <span className="text-xs">✕</span>
            <span>ĐÓNG / CLOSE</span>
          </button>
        </div>

        {/* Tiêu đề COLLECTIONS */}
        <div className="mt-8 mb-5">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase font-sans">
            COLLECTIONS
          </span>
        </div>

        {/* Danh sách các dòng xe */}
        <nav className="flex flex-col space-y-5">
          {/* Mục "Tất cả dòng xe" */}
          <button
            type="button"
            onClick={() => {
              onSelectCategory(null);
              onClose();
            }}
            className="flex items-center justify-between text-left group transition-colors"
          >
            <span
              className={`font-serif text-[18px] sm:text-[19px] leading-tight transition-colors ${
                activeCategory === null
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

          {/* Duyệt qua từng danh mục */}
          {categories.map((c) => {
            const isSelected = activeCategory === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectCategory(c.id);
                  onClose();
                }}
                className="flex items-center justify-between text-left group transition-colors"
              >
                <span
                  className={`font-serif text-[18px] sm:text-[19px] leading-tight transition-colors ${
                    isSelected
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

        {/* Đường kẻ mỏng */}
        <div className="w-full h-[1px] bg-zinc-100 my-6" />

        {/* Liên kết bảo dưỡng */}
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

export default CategorySheet;