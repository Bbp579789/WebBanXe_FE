import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Zap } from "lucide-react";
import { Button } from "../ui/button";
import type { Vehicle } from "../../types";

export interface ProductCardProps {
  car: Vehicle;
  isFavorite?: boolean;
  onAddToCart?: (car: Vehicle) => void;
  onDeposit?: (car: Vehicle) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80";

export const ProductCard: React.FC<ProductCardProps> = ({
  car,
  onAddToCart,
  onDeposit,
}) => {
  const navigate = useNavigate();

  // Giá xe và tiền đặt cọc
  const numericPrice = Number(car?.price) || 0;
  const numericDeposit =
    Number(car?.deposit_amount) ||
    Math.round(numericPrice * 0.05);

  // Thông tin xe từ API
  const brandName = car?.brand || "Mercedes-Benz";
  const modelName = car?.model || "Luxury Model";
  const variantName = car?.variant || "";

  const carStatus = car?.status || "new";

  const statusLabel: Record<string, string> = {
    new: "Xe mới",
    available: "Sẵn sàng",
    sold: "Đã bán",
    reserved: "Đã đặt cọc",
    pending: "Đang cập nhật",
  };

  // Ảnh xe
  const displayImage =
    typeof car?.image_url === "string" &&
    car.image_url.trim() !== ""
      ? car.image_url.trim()
      : FALLBACK_IMAGE;

  // Định dạng giá tiền
  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN");

  // Điều hướng chi tiết
  const handleNavigateDetail = (
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    navigate(
      `/vehicle-detail/${encodeURIComponent(String(car.id))}`,
      {
        state: { vehicle: car },
      }
    );
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(car);
  };

  // Đặt cọc
  const handleDeposit = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onDeposit) {
      onDeposit(car);
      return;
    }

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

          return Number(targetCar?.id) === Number(car?.id);
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
            {brandName} • {car?.year || "---"}
          </span>

          <span className="rounded bg-[#b8955a] px-2.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider text-black shadow-xs">
            {statusLabel[carStatus] || carStatus}
          </span>
        </div>
      </div>

      {/* Thông tin xe */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            <span>
              {variantName || "Mercedes-Benz"}
            </span>

            <span>
              {car?.year || "---"} • {carStatus === "new" ? "Xe mới" : "Thông tin xe"}
            </span>
          </div>

          <h2 className="text-xl font-serif font-bold leading-snug text-zinc-950 transition-colors group-hover:text-[#b8955a]">
            {brandName} {modelName}
          </h2>

          <p className="mt-1 text-xs font-medium text-[#b8955a]">
            {variantName}
          </p>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600">
            {car?.description ||
              `Mercedes-Benz ${modelName} với ngoại thất ${car?.exterior_color || "cao cấp"} và nội thất ${car?.interior_color || "sang trọng"}.`}
          </p>

          {/* Thông số xe */}
          <div className="my-6 grid grid-cols-2 gap-2.5 rounded-2xl border border-zinc-200/60 bg-[#f8f8f7] p-3.5 font-mono text-[11px] text-zinc-700">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Động cơ: {car?.engine || "---"}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Công suất: {car?.power_hp ? `${car.power_hp} HP` : "---"}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Ngoại thất: {car?.exterior_color || "---"}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Số ghế: {car?.seats ? `${car.seats} chỗ` : "---"}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Hộp số: {car?.transmission || "---"}
              </span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-[#b8955a]">✦</span>
              <span className="truncate">
                Nhiên liệu: {car?.fuel || "---"}
              </span>
            </div>
          </div>
        </div>

        {/* Giá xe và thao tác */}
        <div>
          <div className="flex items-end justify-between border-t border-zinc-100 pb-5 pt-3">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                GIÁ NIÊM YẾT CHÍNH THỨC
              </span>

              <span className="font-sans text-xl font-bold text-zinc-950">
                {formatPrice(numericPrice)} đ
              </span>
            </div>

            <div className="text-right">
              <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                ĐẶT CỌC DỰ KIẾN (5%)
              </span>

              <span className="font-mono text-sm font-semibold text-[#b8955a]">
                {formatPrice(numericDeposit)} đ
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