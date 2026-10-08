import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import type { ProductCardProps } from '../../types/product.types';

export const ProductCard: React.FC<ProductCardProps> = ({
  car,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  onDeposit,
}) => {
  const navigate = useNavigate();

  const handleNavigateDetail = () => {
    navigate(`/vehicle-detail/${car.id}`);
  };

  return (
    <div
      onClick={handleNavigateDetail}
      className="group flex flex-col bg-white rounded-3xl border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Ảnh xe & Badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <img
          src={car.image_url}
          alt={car.model}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start pointer-events-none">
          <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-[9px] font-mono tracking-wider font-semibold text-white uppercase border border-white/10">
            {car.badge_top}
          </span>
          {car.badge_sub && (
            <span className="px-2.5 py-0.5 rounded bg-white/95 backdrop-blur-md text-[8.5px] font-mono tracking-wider font-bold text-zinc-900 uppercase">
              {car.badge_sub}
            </span>
          )}
        </div>

        {/* Nút yêu thích
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(car.id);
          }}
          className="absolute top-3.5 right-3.5 size-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-600 hover:text-rose-500 transition shadow-sm cursor-pointer"
          aria-label="Yêu thích"
        >
          <Heart className={`size-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button> */}
      </div>

      {/* Thông tin chi tiết */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-zinc-500 uppercase mb-1.5">
            <span>{car.category_label}</span>
            <span>{car.location_status}</span>
          </div>

          <h2 className="text-xl font-serif font-bold text-zinc-950 group-hover:text-[#b8955a] transition-colors leading-snug">
            {car.brand} {car.model}
          </h2>

          <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-2">
            {car.description}
          </p>

          {/* Thông số Specs */}
          {car.specs && car.specs.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 my-6 p-3.5 rounded-2xl bg-[#f8f8f7] border border-zinc-200/60 text-[11px] text-zinc-700">
              {car.specs.map((item, i) => (
                <div key={i} className="flex items-center gap-2 truncate">
                  <span className="text-[#b8955a] text-xs">✦</span>
                  <span className="truncate font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Khối giá & Nút thao tác */}
        <div>
          <div className="flex items-end justify-between pt-2 pb-5 border-t border-zinc-100">
            <div>
              <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                GIÁ PHÂN BỔ ATELIER
              </span>
              <span className="text-xl font-bold font-sans text-zinc-950">
                ${car.price.toLocaleString('en-US')}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                ĐẶT CỌC BẢO LƯU
              </span>
              <span className="text-sm font-semibold font-mono text-[#b8955a]">
                ${car.deposit_amount.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Nút Thêm giỏ */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(car);
                }}
                className="h-11 rounded-xl text-xs font-bold tracking-wider uppercase border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-400 active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShoppingBag className="size-3.5" />
                <span>THÊM GIỎ</span>
              </button>

              {/* Nút Đặt cọc */}
              <Button
                type="button"
                variant="brand"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeposit?.(car);
                }}
                className="h-11 rounded-xl text-xs font-bold tracking-wider uppercase shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="size-3.5" />
                <span>ĐẶT CỌC</span>
              </Button>
            </div>

            {/* Nút Khám phá thông số chi tiết */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateDetail();
              }}
              className="w-full text-center text-xs font-medium text-zinc-500 hover:text-zinc-950 transition py-1 block cursor-pointer"
            >
              KHÁM PHÁ THÔNG SỐ CHI TIẾT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;