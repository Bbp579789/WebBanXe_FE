import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Zap } from "lucide-react";
import { Button } from "../ui/button";
import type { Vehicle } from "../../types";

export interface ProductCardProps {
  car: Vehicle;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onAddToCart?: (car: Vehicle) => void;
  onDeposit?: (car: Vehicle) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80";

export const ProductCard: React.FC<ProductCardProps> = ({
  car,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  onDeposit,
}) => {
  const navigate = useNavigate();

  // Giá xe và tiền đặt cọc
  const numericPrice = Number(car?.price) || 0;
  const numericDeposit =
    Number(car?.deposit_amount) ||
    Math.round(numericPrice * 0.05);

  // Thông tin xe
  const brandName = car?.brand || "Mercedes-Benz";
  const modelName = car?.model || "Luxury Model";
  const carStatus = (car?.status || "new").toUpperCase();

  const carVin = car?.vin ? String(car.vin) : "";
  const carVinDisplay = carVin
    ? `VIN: ${carVin.slice(0, 8)}...`
    : "VIN: ĐANG CẬP NHẬT";

  // Lấy URL ảnh Cloudinary từ trường image_url của bảng vehicle
  const displayImage =
    typeof car?.image_url === "string" &&
    car.image_url.trim() !== ""
      ? car.image_url.trim()
      : FALLBACK_IMAGE;

  // Điều hướng sang trang chi tiết xe
  const handleNavigateDetail = (
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    const targetId =
      car?.id ??
      (car as any)?._id ??
      (car as any)?.vehicle_id ??
      car?.vin ??
      `${brandName}-${modelName}`
        .toLowerCase()
        .replace(/\s+/g, "-");

    navigate(
      `/vehicle-detail/${encodeURIComponent(String(targetId))}`,
      {
        state: { vehicle: car },
      }
    );
  };

  // Thêm xe vào giỏ hàng
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(car);
  };

  // Xử lý đặt cọc
  const handleDeposit = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onDeposit) {
      onDeposit(car);
      return;
    }

    // Dự phòng khi component cha không truyền onDeposit
    const userName =
      localStorage.getItem("userName") || "guest";
    const cartKey = `valoir_cart_${userName}`;

    try {
      const currentCart = JSON.parse(
        localStorage.getItem(cartKey) || "[]"
      );

      const existingIndex = currentCart.findIndex(
        (item: any) => {
          const targetCar =
            item?.vehicle || item?.car || item;

          return targetCar?.id === car?.id;
        }
      );

      if (existingIndex >= 0) {
        currentCart[existingIndex].quantity =
          (currentCart[existingIndex].quantity || 1) + 1;
      } else {
        currentCart.push({
          id: Date.now(),
          vehicle_id: car?.id,
          quantity: 1,
          vehicle: car,
        });
      }

      localStorage.setItem(
        cartKey,
        JSON.stringify(currentCart)
      );

      window.dispatchEvent(new Event("cartChange"));
      navigate("/payment");
    } catch (error) {
      console.error("Lỗi xử lý đặt cọc:", error);
    }
  };

  return (
    <div
      onClick={handleNavigateDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleNavigateDetail();
        }
      }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs transition-all duration-300 hover:border-zinc-300 hover:shadow-xl cursor-pointer"
    >
      {/* Ảnh xe và nhãn */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <img
          src={displayImage}
          alt={`${brandName} ${modelName}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;

            if (img.src !== FALLBACK_IMAGE) {
              img.src = FALLBACK_IMAGE;
            }
          }}
        />

        <div className="pointer-events-none absolute left-3.5 top-3.5 flex flex-col items-start gap-1.5">
          <span className="rounded border border-white/10 bg-black/75 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            {car?.badge_top ||
              `${brandName.toUpperCase()} • ${car?.year || 2024}`}
          </span>

          <span className="rounded bg-[#b8955a] px-2.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider text-black shadow-xs">
            {car?.badge_sub || `STATUS: ${carStatus}`}
          </span>
        </div>

        {/* Nút yêu thích */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            if (car?.id != null) {
              onToggleFavorite?.(Number(car.id));
            }
          }}
          className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full bg-white/90 text-zinc-600 shadow-sm transition hover:text-rose-500 cursor-pointer"
          aria-label="Yêu thích"
        >
          <Heart
            className={`size-4 ${
              isFavorite
                ? "fill-rose-500 text-rose-500"
                : ""
            }`}
          />
        </button>
      </div>

      {/* Thông tin xe */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            <span>
              {car?.category_label || carVinDisplay}
            </span>

            <span>
              {car?.location_status ||
                `${car?.year || 2024} • Sẵn sàng`}
            </span>
          </div>

          <h2 className="text-xl font-serif font-bold leading-snug text-zinc-950 transition-colors group-hover:text-[#b8955a]">
            {brandName} {modelName}
          </h2>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600">
            {car?.description ||
              `Ngoại thất màu ${
                car?.exterior_color || "tiêu chuẩn"
              }, nội thất ${
                car?.interior_color || "cao cấp"
              }. Động cơ ${
                car?.engine_no || "chính hãng"
              }.`}
          </p>

          {/* Thông số xe */}
          <div className="my-6 grid grid-cols-2 gap-2.5 rounded-2xl border border-zinc-200/60 bg-[#f8f8f7] p-3.5 font-mono text-[11px] text-zinc-700">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Năm: {car?.year || "---"}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Màu: {car?.exterior_color || "---"}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Máy: {car?.engine_no || "---"}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Ghế: {car?.interior_color || "---"}
              </span>
            </div>
          </div>
        </div>

        {/* Giá xe và thao tác */}
        <div>
          <div className="flex items-end justify-between border-t border-zinc-100 pb-5 pt-2">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                GIÁ NIÊM YẾT CHÍNH THỨC
              </span>

              <span className="font-sans text-xl font-bold text-zinc-950">
                ${numericPrice.toLocaleString("en-US")}
              </span>
            </div>

            <div className="text-right">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                ĐẶT CỌC BẢO LƯU
              </span>

              <span className="font-mono text-sm font-semibold text-[#b8955a]">
                ${numericDeposit.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-bold uppercase tracking-wider text-zinc-800 shadow-2xs transition hover:bg-zinc-50 cursor-pointer"
              >
                <ShoppingBag className="size-3.5" />
                <span>THÊM GIỎ</span>
              </button>

              <Button
                type="button"
                variant="brand"
                onClick={handleDeposit}
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
              >
                <Zap className="size-3.5" />
                <span>ĐẶT CỌC</span>
              </Button>
            </div>

            <div
              onClick={handleNavigateDetail}
              className="block w-full cursor-pointer select-none py-1 text-center text-xs font-medium text-zinc-500 transition hover:text-zinc-950"
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