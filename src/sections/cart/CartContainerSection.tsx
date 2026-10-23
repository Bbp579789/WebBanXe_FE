import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Sliders, X, ArrowRight, Check, Calendar, ShieldCheck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { Button } from '../../components/ui/button';

export const CartContainerSection: React.FC = () => {
  const navigate = useNavigate();
  // Bổ sung thêm handleUpdateQuantity từ hook useCart
  const { cartItems, subtotal, handleRemove, handleUpdateQuantity } = useCart();

  // Tính toán số lượng & tài chính từ dữ liệu DB
  const totalVehiclesCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  
  // Tiền cọc mặc định 50.000.000 VNĐ / xe
  const depositPerCar = 50000000;
  const totalDeposit = totalVehiclesCount * depositPerCar;

  // Thuế & phụ phí dự tính (Có thể tính theo % giá xe thực tế)
  const bespokePrice = cartItems.length > 0 ? 64000000 : 0;
  const vipDiscount = cartItems.length > 0 ? 100000000 : 0;
  const registrationFee = cartItems.length > 0 ? 78000000 : 0;
  const totalOnRoad = subtotal + bespokePrice - vipDiscount + registrationFee;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pb-20">
        <div className="py-24 text-center bg-white rounded-3xl border border-zinc-200/80 shadow-xs p-8">
          <h2 className="text-xl font-serif font-bold text-zinc-900">Giỏ hàng Bespoke của bạn đang trống</h2>
          <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto font-light">
            Quý khách chưa lựa chọn cỗ máy Bespoke nào. Hãy khám phá bộ sưu tập Atelier độc bản.
          </p>
          <Button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="mt-6 h-11 px-8 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Khám phá kho xe ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pb-20 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* CỘT TRÁI: DANH SÁCH CÁC THẺ XE LAYOUT BESPOKE COMMISSION */}
        <div className="lg:col-span-8 space-y-8">
          {cartItems.map((item) => {
            const vehicle = item?.vehicle;
            if (!vehicle) return null;

            // Đọc dữ liệu trực tiếp từ đối tượng Vehicle của Database
            const brandName = vehicle.brand || 'Mercedes-Benz';
            const modelName = vehicle.model || 'Atelier Model';
            const carYear = vehicle.year || 2026;
            const vinNo = vehicle.vin || `VLR-VIN-${vehicle.id || '9921'}`;
            const engineNo = vehicle.engine_no || 'V8 Twin-Turbo Hybrid';
            const exteriorColor = vehicle.exterior_color || 'Selenite Gray Magno';
            const interiorColor = vehicle.interior_color || 'AMG Black Nappa / Red Stitch';
            const price = Number(vehicle.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const itemTotalPrice = price * quantity;

            const displayImage =
              vehicle.image_url ||
              'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&auto=format&fit=crop&q=80';

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6 relative"
              >
                {/* HEADER CỦA THẺ XE */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[9px] font-mono font-bold tracking-widest uppercase">
                        BESPOKE COMMISSION
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Số VIN dự kiến: #{vinNo}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-2">
                      {brandName} {modelName}
                    </h2>

                    <p className="text-xs text-zinc-500 font-light mt-1">
                      Biểu tượng Gran Turismo động cơ đốt trong thuần khiết • Phiên bản giới hạn Atelier ({carYear})
                    </p>
                  </div>

                  {/* CÁC NÚT THAO TÁC CỦA THẺ */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className="size-9 rounded-full bg-zinc-50 border border-zinc-200/80 hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition cursor-pointer"
                      title="In cấu hình"
                    >
                      <Printer className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="size-9 rounded-full bg-zinc-50 border border-zinc-200/80 hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition cursor-pointer"
                      title="Chỉnh sửa cấu hình"
                    >
                      <Sliders className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(vehicle.id)}
                      className="size-9 rounded-full bg-zinc-50 border border-zinc-200/80 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 flex items-center justify-center text-zinc-400 transition cursor-pointer"
                      title="Xóa khỏi giỏ"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                {/* KHU VỰC THÔNG SỐ & HÌNH ẢNH 2 CỘT */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  
                  {/* CỘT TRÁI: KHUNG ẢNH XE CHUẨN CÂN BẰNG TỶ LỆ */}
                  <div className="md:col-span-5 relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-100 shrink-0">
                    <img
                      src={displayImage}
                      alt={`${brandName} ${modelName}`}
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                    
                    {/* Badge thông số động cơ */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-mono tracking-wider font-bold text-white uppercase border border-white/10">
                      {engineNo}
                    </div>

                    {/* Badge màu ngoại thất */}
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-medium text-zinc-900 shadow-sm flex items-center gap-1.5 max-w-[90%] truncate">
                      <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                      <span className="truncate">{exteriorColor}</span>
                    </div>
                  </div>

                  {/* CỘT PHẢI: LƯỚI THÔNG SỐ XE */}
                  <div className="md:col-span-7 grid grid-cols-2 gap-3 text-left">
                    {/* Ngoại thất */}
                    <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100/80">
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                        NGOẠI THẤT & SƠN
                      </span>
                      <p className="text-xs font-bold text-zinc-950 mt-1 truncate">{exteriorColor}</p>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Lớp hoàn thiện kim loại 5 tầng</p>
                    </div>

                    {/* Nội thất */}
                    <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100/80">
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                        NỘI THẤT KHOANG LÁI
                      </span>
                      <p className="text-xs font-bold text-zinc-950 mt-1 truncate">{interiorColor}</p>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Chỉ thêu thủ công họa tiết kim cương</p>
                    </div>

                    {/* Số VIN */}
                    <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100/80">
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                        MÃ ĐỊNH DANH VIN
                      </span>
                      <p className="text-xs font-bold font-mono text-zinc-950 mt-1 truncate">{vinNo}</p>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Đã kiểm định 150 điểm GIA</p>
                    </div>

                    {/* Động cơ */}
                    <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100/80">
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                        ĐỘNG CƠ & HỘP SỐ
                      </span>
                      <p className="text-xs font-bold text-zinc-950 mt-1 truncate">{engineNo}</p>
                      <p className="text-[10px] text-zinc-500 font-light mt-0.5">Tiêu chuẩn Châu Âu Euro 6</p>
                    </div>

                    {/* Gói Bespoke */}
                    <div className="col-span-2 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100/80 space-y-1.5">
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold mb-2">
                        GÓI TRANG BỊ BESPOKE CÁ NHÂN HÓA
                      </span>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200/60 text-[11px] font-medium text-zinc-800">
                        <Check className="size-3 text-[#b8955a] shrink-0" />
                        <span className="truncate">Mâm rèn đa chấu 22" Diamond-Cut</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200/60 text-[11px] font-medium text-zinc-800">
                        <Check className="size-3 text-[#b8955a] shrink-0" />
                        <span className="truncate">Âm thanh vòm 3D 18 loa High-End</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* GIÁ XE, SỐ LƯỢNG & TIỀN CỌC CHÂN THẺ XE */}
                <div className="pt-6 border-t border-zinc-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  
                  {/* CỤM NÚT TĂNG GIẢM SỐ LƯỢNG VÀ THÔNG TIN GIÁ */}
                  <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
                    
                    {/* Nút điều chỉnh số lượng */}
                    <div>
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold mb-1.5">
                        SỐ LƯỢNG (XE)
                      </span>
                      <div className="flex items-center gap-1 border border-zinc-200/80 rounded-xl px-1 bg-white shadow-2xs h-10 w-max">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(vehicle, -1)}
                          className="w-8 h-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 font-bold rounded-lg transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-medium font-mono text-sm w-6 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(vehicle, 1)}
                          className="w-8 h-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 font-bold rounded-lg transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Tổng giá niêm yết */}
                    <div className="border-l border-zinc-200 pl-6 sm:pl-8">
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                        TỔNG GIÁ NIÊM YẾT
                      </span>
                      <span className="text-xl sm:text-2xl font-bold font-sans text-zinc-950 mt-0.5 block">
                        {itemTotalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    {/* Tiền đặt cọc */}
                    <div className="border-l border-zinc-200 pl-6 sm:pl-8">
                      <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                        TIỀN ĐẶT CỌC GIỮ XE
                      </span>
                      <span className="text-xl sm:text-2xl font-bold font-mono text-[#b8955a] mt-0.5 block">
                        {(depositPerCar * quantity).toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                  </div>

                  {/* Trạng thái kho xe */}
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50/50 text-[11px] text-emerald-800 font-mono border border-emerald-100">
                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Xe sẵn sàng • Bàn giao 10 ngày</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* CỘT PHẢI: BẢN TÓM TẮT ĐẶT HÀNG - TÀI CHÍNH & ĐẶT CỌC */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6 sticky top-24">
          
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                BẢN TÓM TẮT ĐẶT HÀNG
              </span>
              <h2 className="text-xl font-serif font-bold text-zinc-950 mt-0.5">
                Tài Chính & Đặt Cọc
              </h2>
            </div>
            <span className="size-3 rounded-full bg-[#b8955a]" />
          </div>

          {/* CHI TIẾT CHI PHÍ */}
          <div className="space-y-3.5 text-xs font-sans">
            <div className="flex justify-between text-zinc-600">
              <span>Tổng giá niêm yết ({totalVehiclesCount} xe):</span>
              <span className="font-mono font-bold text-zinc-900">{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex justify-between text-zinc-600">
              <span>Trang bị Bespoke & Phụ kiện:</span>
              <span className="font-mono font-semibold text-zinc-900">+{bespokePrice.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex justify-between text-zinc-600">
              <span className="flex items-center gap-1.5">
                <span className="size-3.5 rounded-full border border-amber-600 text-amber-600 flex items-center justify-center text-[8px] font-bold">✓</span>
                <span>Ưu đãi thành viên VIP:</span>
              </span>
              <span className="font-mono font-bold text-amber-600">-{vipDiscount.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex justify-between text-zinc-600 border-b border-zinc-100 pb-4">
              <span>Thuế trước bạ & Biển số (tạm tính):</span>
              <span className="font-mono font-semibold text-zinc-900">+{registrationFee.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                TỔNG LĂN BÁNH:
              </span>
              <span className="font-mono text-xl font-extrabold text-zinc-950">
                {totalOnRoad.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* KHỐI ĐẶT CỌC NỔI BẬT */}
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-center">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase font-bold tracking-wider">
              <span>🔒 ĐẶT CỌC GIỮ XE:</span>
              <span className="text-zinc-950">{totalVehiclesCount} Xe</span>
            </div>

            <div className="text-3xl font-extrabold font-mono text-zinc-950 py-1">
              {totalDeposit.toLocaleString('vi-VN')} đ
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500 pt-1 truncate">
              <span>Cọc cố định: {depositPerCar.toLocaleString('vi-VN')} đ / xe</span>
            </div>
          </div>

          {/* NÚT ĐIỀU HƯỚNG SANG TRANG PAYMENT */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => navigate('/payment')} // Chuyển thẳng sang trang payment
              className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <span>TIẾN HÀNH THANH TOÁN ĐẶT CỌC</span>
              <ArrowRight className="size-4" />
            </Button>

            <button
              type="button"
              className="w-full h-11 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Calendar className="size-4 text-zinc-500" />
              <span>Đặt lịch chuyên viên tư vấn tận nơi</span>
            </button>
          </div>

          {/* CAM KẾT */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 font-light">
            <div className="flex items-center gap-2">
              <span className="size-3.5 rounded-full border border-zinc-400 flex items-center justify-center text-[8px]">✓</span>
              <span>Hoàn cọc 100% linh hoạt trong 7 ngày không lý do</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3.5 rounded-full border border-zinc-400 flex items-center justify-center text-[8px]">🛡</span>
              <span>Bảo hiểm hành trình & vận chuyển bít bùng tận cửa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3.5 rounded-full border border-zinc-400 flex items-center justify-center text-[8px]">✦</span>
              <span>Bảo hành chính hãng 5 năm / 150.000 km toàn quốc</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};