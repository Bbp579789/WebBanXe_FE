import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import type { Vehicle } from '../../types';

export interface ProductCardProps {
  car: Vehicle;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onAddToCart?: (car: Vehicle) => void;
  onDeposit?: (car: Vehicle) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  car,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  onDeposit,
}) => {
  const navigate = useNavigate();

  // 1. Chuyển đổi an toàn giá bán & tiền cọc từ DB
  const numericPrice = Number(car?.price) || 0;
  const numericDeposit =
    Number(car?.deposit_amount) || Math.round(numericPrice * 0.05);

  // 2. Fallback an toàn cho chuỗi ký tự
  const brandName = car?.brand || 'Mercedes-Benz';
  const modelName = car?.model || 'Luxury Model';
  const carStatus = (car?.status || 'new').toUpperCase();
  const carVin = car?.vin ? String(car.vin) : '';
  const carVinDisplay = carVin ? `VIN: ${carVin.slice(0, 8)}...` : 'VIN: ĐANG CẬP NHẬT';

  // 3. Fallback ảnh nếu image_url trong DB là null
  const displayImage =
    car?.image_url ||
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80';

  // Điều hướng chi tiết sản phẩm
  // const handleNavigateDetail = (e?: React.MouseEvent) => {
  //   if (e) e.stopPropagation();
    
  //   const targetId = car?.id;
  //   if (targetId !== undefined && targetId !== null) {
  //     navigate(`/vehicle-detail/${targetId}`);
  //   } else {
  //     console.warn('Không tìm thấy ID xe để điều hướng:', car);
  //   }
  // };
  // Điều hướng sang trang chi tiết (Truyền kèm object car vào state của Router)
  const handleNavigateDetail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const targetId =
      car?.id ??
      (car as any)?._id ??
      (car as any)?.vehicle_id ??
      car?.vin ??
      `${car?.brand || 'car'}-${car?.model || 'detail'}`.toLowerCase().replace(/\s+/g, '-');

    // Chuyển sang trang chi tiết và gửi kèm dữ liệu xe qua state
    navigate(`/vehicle-detail/${encodeURIComponent(String(targetId))}`, {
      state: { vehicle: car },
    });
  };

  return (
    <div
      onClick={handleNavigateDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleNavigateDetail();
      }}
      className="group flex flex-col bg-white rounded-3xl border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* ẢNH XE & BADGES */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <img
          src={displayImage}
          alt={`${brandName} ${modelName}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start pointer-events-none">
          <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-[9px] font-mono tracking-wider font-semibold text-white uppercase border border-white/10">
            {car?.badge_top || `${brandName.toUpperCase()} • ${car?.year || 2024}`}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-[#b8955a] text-black text-[8.5px] font-mono tracking-wider font-bold uppercase shadow-xs">
            {car?.badge_sub || `STATUS: ${carStatus}`}
          </span>
        </div>

        {/* Nút yêu thích */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (car?.id) onToggleFavorite?.(Number(car.id));
          }}
          className="absolute top-3.5 right-3.5 size-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-600 hover:text-rose-500 transition shadow-sm cursor-pointer"
          aria-label="Yêu thích"
        >
          <Heart className={`size-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* THÔNG TIN CHI TIẾT */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-zinc-500 uppercase mb-1.5">
            <span>{car?.category_label || carVinDisplay}</span>
            <span>{car?.location_status || `${car?.year || 2024} • Sẵn sàng`}</span>
          </div>

          <h2 className="text-xl font-serif font-bold text-zinc-950 group-hover:text-[#b8955a] transition-colors leading-snug">
            {brandName} {modelName}
          </h2>

          <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-2">
            {car?.description ||
              `Ngoại thất màu ${car?.exterior_color || 'tiêu chuẩn'}, nội thất ${car?.interior_color || 'cao cấp'}. Động cơ ${car?.engine_no || 'chính hãng'}.`}
          </p>

          {/* Khối specs linh hoạt từ DB */}
          <div className="grid grid-cols-2 gap-2.5 my-6 p-3.5 rounded-2xl bg-[#f8f8f7] border border-zinc-200/60 text-[11px] text-zinc-700 font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">Năm: {car?.year || '---'}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">Màu: {car?.exterior_color || '---'}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">Máy: {car?.engine_no || '---'}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">Ghế: {car?.interior_color || '---'}</span>
            </div>
          </div>
        </div>

        {/* GIÁ TIỀN & CÁC NÚT THAO TÁC */}
        <div>
          <div className="flex items-end justify-between pt-2 pb-5 border-t border-zinc-100">
            <div>
              <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                GIÁ NIÊM YẾT CHÍNH THỨC
              </span>
              <span className="text-xl font-bold font-sans text-zinc-950">
                ${numericPrice.toLocaleString('en-US')}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                ĐẶT CỌC BẢO LƯU
              </span>
              <span className="text-sm font-semibold font-mono text-[#b8955a]">
                ${numericDeposit.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(car);
                }}
                className="h-11 rounded-xl text-xs font-bold tracking-wider uppercase border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShoppingBag className="size-3.5" />
                <span>THÊM GIỎ</span>
              </button>

              {/* NÚT ĐẶT CỌC ĐÃ ĐƯỢC CẬP NHẬT LUỒNG */}
              <Button
                type="button"
                variant="brand"
                onClick={(e) => {
                  e.stopPropagation();
                  
                  // 1. Nếu component cha có truyền hàm onDeposit riêng thì gọi nó
                  if (onDeposit) {
                    onDeposit(car);
                  } else {
                    // 2. Nếu không, tự động thêm xe vào giỏ hàng của tài khoản hiện tại và chuyển sang trang Payment
                    const userName = localStorage.getItem('userName') || 'guest';
                    const cartKey = `valoir_cart_${userName}`;
                    
                    // Lấy giỏ hàng cũ ra
                    const currentCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
                    
                    // Kiểm tra xem xe đã có trong giỏ chưa
                    const existingIndex = currentCart.findIndex((item: any) => {
                      const targetCar = item?.vehicle || item?.car || item;
                      return targetCar?.id === car?.id;
                    });

                    if (existingIndex > -1) {
                      currentCart[existingIndex].quantity = (currentCart[existingIndex].quantity || 1) + 1;
                    } else {
                      currentCart.push({
                        id: Date.now(),
                        vehicle_id: car?.id || 1,
                        quantity: 1,
                        vehicle: car
                      });
                    }

                    // Lưu lại vào localStorage và phát sự kiện cập nhật giỏ hàng
                    localStorage.setItem(cartKey, JSON.stringify(currentCart));
                    window.dispatchEvent(new Event('cartChange'));
                  }

                  // 3. Chuyển hướng ngay lập tức sang trang thanh toán /payment
                  navigate('/payment');
                }}
                className="h-11 rounded-xl text-xs font-bold tracking-wider uppercase shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="size-3.5" />
                <span>ĐẶT CỌC</span>
              </Button>
            </div>

            {/* Dòng chữ chuyển trang: Dùng div thay button để tránh lồng button trong button */}
            <div
              onClick={handleNavigateDetail}
              className="w-full text-center text-xs font-medium text-zinc-500 hover:text-zinc-950 transition py-1 block cursor-pointer select-none"
            >
              KHÁM PHÁ THÔNG SỐ CHI TIẾT →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;