import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ZoomIn,
  RotateCw,
  FileText,
  ChevronRight,
  ShoppingBag,
  Heart,
  Share2,
  Home,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useVehicleDetail } from '../../hooks/useVehicleDetail';
import { LoginDialog } from '../../components/common/header/LoginDialog';
import { cartService } from '../../services/api/cartService';

export const VehicleDetailHeroSection: React.FC = () => {
  const {
    vehicle,
    isLoginOpen,
    closeLogin,
    handleBookTestDrive,
    handleLoginSuccess,
  } = useVehicleDetail(); // Đã xóa onDeposit, car ở đây để tránh trùng lặp biến
  
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedExterior, setSelectedExterior] = useState(
    vehicle?.exterior_color || 'Selenite Gray Magno'
  );
  const [selectedInterior, setSelectedInterior] = useState(
    vehicle?.interior_color || 'AMG Black Nappa / Red Stitch'
  );
  const [activeThumbIndex] = useState(0);

  // State quản lý Toast thông báo góc trên bên phải
  const [toast, setToast] = useState<{ show: boolean; message: string; carName: string } | null>(null);

  // Tự động tắt Toast thông báo sau 3 giây
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const numericPrice = Number(vehicle?.price) || 4899000000;
  const originalPrice = numericPrice * 1.06;
  const depositAmount = 100000000;

  const brandName = vehicle?.brand || 'Mercedes-AMG';
  const modelName = vehicle?.model || 'C 63 S E Performance';
  const mainImage =
    vehicle?.image_url ||
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop&q=80';

  const thumbnails = [
    { label: 'Góc chính', src: mainImage },
    { label: 'Cabin MBUX', icon: '+', sub: 'Cabin MBUX' },
    { label: 'AMG Diffuser', icon: 'img', sub: 'AMG Diffuser' },
    { label: 'Forged 20"', icon: 'wheel', sub: 'Forged 20"' },
    { label: 'AMG Plaque', icon: 'shield', sub: 'AMG Plaque' },
  ];

  // 1. LUỒNG XỬ LÝ: THÊM GIỎ HÀNG
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vehicle) {
      cartService.addToCart(vehicle, quantity); // Truyền kèm quantity
      setToast({
        show: true,
        message: 'Đã thêm thành công vào giỏ hàng!',
        carName: `${brandName} ${modelName}`,
      });
    }
  };

 // LUỒNG XỬ LÝ: ĐẶT CỌC (MUA NGAY)
  const handleDepositClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (vehicle) {
      // 1. Xóa sạch giỏ hàng cũ (để không bị dính các xe đã thêm trước đó)
      cartService.clearCart();
      
      // 2. Thêm duy nhất chiếc xe này vào giỏ
      cartService.addToCart(vehicle, quantity); 
    }
    
    // 3. Chuyển thẳng sang trang thanh toán
    navigate('/payment'); 
  };

  return (
    <>
      <section className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pt-20 pb-10 select-none relative">
        {/* THANH BREADCRUMB NGANG HÀNG NGAY DƯỚI HEADER */}
        <div className="w-full py-3.5 mb-6 border-b border-zinc-200/80 flex items-center justify-between">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-row items-center gap-2 text-xs font-mono text-zinc-500 whitespace-nowrap overflow-x-auto"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <Home className="size-3.5 text-[#b8955a]" />
              <span>Home</span>
            </Link>

            <span className="text-zinc-300">/</span>

            <Link
              to="/vehicles"
              className="hover:text-[#b8955a] transition-colors font-medium cursor-pointer"
            >
              Kho xe
            </Link>

            <span className="text-zinc-300">/</span>

            <span className="text-zinc-900 font-semibold truncate">
              Thông tin xe ({brandName} {modelName})
            </span>
          </nav>
        </div>

        {/* KHUNG 2 CỘT CHÍNH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* CỘT TRÁI: Gallery & Ảnh lớn */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200/80 shadow-sm group">
              <img
                src={thumbnails[activeThumbIndex]?.src || mainImage}
                alt={`${brandName} ${modelName}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono tracking-wider font-semibold text-zinc-800 shadow-xs border border-white/40">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>CERTIFIED PRE-OWNED • 150-POINT INSPECTED</span>
              </div>

              <button
                type="button"
                className="absolute bottom-4 right-4 size-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition shadow-sm cursor-pointer"
                title="Phóng to ảnh"
              >
                <ZoomIn className="size-4" />
              </button>
            </div>

            {/* Tiện ích bổ trợ dưới ảnh */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs text-zinc-600 border-t border-zinc-100">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-zinc-950 transition cursor-pointer"
                >
                  <RotateCw className="size-3.5 text-[#b8955a]" />
                  <span>Trải nghiệm xoay 360° Studio</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-zinc-950 transition cursor-pointer"
                >
                  <FileText className="size-3.5 text-[#b8955a]" />
                  <span>Brochure & Spec Sheet (PDF)</span>
                </button>
              </div>

              <span className="flex items-center gap-1 text-[#b8955a] font-mono text-xs font-semibold cursor-pointer hover:underline">
                <span>Tra cứu VIN & Kiểm định GIA</span>
                <ChevronRight className="size-3" />
              </span>
            </div>
          </div>

          {/* CỘT PHẢI: Thông tin giá & Đặt cọc */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#b8955a] uppercase font-bold">
                  {brandName.toUpperCase()} PERFORMANCE DIVISION
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-1 leading-snug">
                  {brandName} {modelName}
                </h1>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Năm: {vehicle?.year || 2026} | Động cơ: {vehicle?.engine_no || '2.0L Turbo Hybrid'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 font-mono text-[10px] font-semibold tracking-wider shrink-0">
                Mã: VLR-{vehicle?.id || '01'}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                GIÁ CHUYỂN NHƯỢNG CHÍNH THỨC (ĐÃ BAO GỒM VAT)
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold font-sans text-zinc-950 tracking-tight">
                  {numericPrice.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-xs font-mono text-zinc-400 line-through">
                  {originalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-emerald-950 font-sans">
                    ĐẶT CỌC TRỰC TUYẾN GIỮ XE 72H
                  </p>
                  <p className="text-emerald-700 font-mono text-[11px] mt-0.5">
                    {depositAmount.toLocaleString('vi-VN')} đ / xe
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white text-emerald-800 text-[10px] font-medium border border-emerald-200 shadow-2xs">
                  Hoàn cọc 100% trong 24h
                </span>
              </div>
            </div>

            {/* Màu Ngoại Thất */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900">Màu Ngoại Thất:</span>
                <span className="text-zinc-500 text-[11px]">{selectedExterior}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedExterior(vehicle?.exterior_color || 'Selenite Gray Magno')
                  }
                  className={`size-7 rounded-full bg-zinc-600 ring-offset-2 transition cursor-pointer ${
                    selectedExterior === (vehicle?.exterior_color || 'Selenite Gray Magno')
                      ? 'ring-2 ring-zinc-950'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSelectedExterior('Obsidian Black Metallic')}
                  className={`size-7 rounded-full bg-black ring-offset-2 transition cursor-pointer ${
                    selectedExterior === 'Obsidian Black Metallic' ? 'ring-2 ring-zinc-950' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSelectedExterior('Diamond White Bright')}
                  className={`size-7 rounded-full bg-zinc-100 border border-zinc-300 ring-offset-2 transition cursor-pointer ${
                    selectedExterior === 'Diamond White Bright' ? 'ring-2 ring-zinc-950' : ''
                  }`}
                />
              </div>
            </div>

            {/* Chất liệu Nội Thất */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900">Chất liệu Nội Thất:</span>
                <span className="text-zinc-500 text-[11px]">{selectedInterior}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedInterior(
                      vehicle?.interior_color || 'AMG Black Nappa / Red Stitch'
                    )
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition cursor-pointer ${
                    selectedInterior ===
                    (vehicle?.interior_color || 'AMG Black Nappa / Red Stitch')
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <span className="size-2 rounded-full bg-rose-500" />
                  <span>{vehicle?.interior_color || 'AMG Black Nappa / Red Stitch'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedInterior('Titanium Gray Pearl')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition cursor-pointer ${
                    selectedInterior === 'Titanium Gray Pearl'
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <span>Titanium Gray Pearl</span>
                </button>
              </div>
            </div>

            {/* Bộ chọn số lượng + Nút hành động */}
            <div className="space-y-3 pt-3 border-t border-zinc-100">
              <div className="flex items-center justify-between border border-zinc-200 rounded-xl px-4 py-2 bg-zinc-50 text-xs">
                <span className="text-zinc-500 font-medium">Số lượng xe:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-500 hover:text-black font-bold px-2 py-0.5 rounded bg-white border border-zinc-200 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-medium font-mono text-sm">{quantity} xe</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-500 hover:text-black font-bold px-2 py-0.5 rounded bg-white border border-zinc-200 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="h-11 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <ShoppingBag className="size-4 text-[#b8955a]" />
                  <span>Thêm giỏ hàng</span>
                </button>

                <button
                  type="button"
                  onClick={handleDepositClick}
                  className="h-11 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Zap className="size-4 text-[#b8955a]" />
                  <span>Đặt cọc</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-xs text-zinc-500 border-t border-zinc-100">
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-zinc-900 transition cursor-pointer"
              >
                <Heart className="size-3.5" />
                <span>Lưu xe yêu thích</span>
              </button>
              <span>•</span>
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-zinc-900 transition cursor-pointer"
              >
                <Share2 className="size-3.5" />
                <span>Chia sẻ cấu hình xe</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TOAST THÔNG BÁO Ở GÓC TRÊN CÙNG BÊN PHẢI (TOP-6 RIGHT-6) */}
      {toast?.show && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-950/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl border border-zinc-800 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="size-9 rounded-full bg-[#b8955a]/20 text-[#b8955a] flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold font-sans text-white">{toast.message}</h4>
            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">{toast.carName}</p>
          </div>
        </div>
      )}

      <LoginDialog
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default VehicleDetailHeroSection;