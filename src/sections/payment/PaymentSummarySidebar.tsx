import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useCart } from '../../hooks/useCart';
import { cartService } from '../../services/api/cartService';
import { orderService } from '../../services/api/orderService';

interface PaymentSummaryProps {
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onConfirm?: () => void;
  handleCompletePayment?: () => void; // Có thể nhận từ props hoặc tự xử lý bên trong
}

export const PaymentSummarySidebar: React.FC<PaymentSummaryProps> = ({ 
  step, 
  onNextStep, 
  onPrevStep, 
}) => {
  const navigate = useNavigate();
  const { cartItems, subtotal } = useCart();
  
  const totalVehiclesCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const totalDeposit = totalVehiclesCount * 50000000;

  // HÀM HOÀN TẤT ĐẶT CỌC VÀ TẠO ĐƠN HÀNG CHUẨN ERD
  const handleCompletePayment = () => {
    // 1. Lấy danh sách xe trong giỏ hàng hiện tại
    const items = cartService.getCartItems();
    
    if (items.length === 0) {
      alert("Giỏ hàng của bạn đang trống, không thể tạo đơn hàng!");
      return;
    }

    // 2. Tính tổng tiền niêm yết của các xe trong giỏ
    const calculatedTotal = items.reduce((sum: number, item: any) => {
      const vehicleObj = item?.vehicle || item?.car || item;
      const price = Number(vehicleObj?.price) || 0;
      return sum + (price * Number(item.quantity || 1));
    }, 0);

    // 3. Gọi service tạo đơn hàng (lưu vào localStorage theo đúng account đang login)
    orderService.createOrder(items, 'VNPAY', calculatedTotal > 0 ? calculatedTotal : subtotal);

    // 4. Dọn sạch giỏ hàng của user sau khi đã chốt đơn thành công
    cartService.clearCart();
    window.dispatchEvent(new Event('cartChange'));

    // 5. Chuyển hướng người dùng sang trang OrderPage
    navigate('/order');
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs sticky top-24">
      <div className="border-b border-zinc-100 pb-4 mb-4">
        <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
          BẢN TÓM TẮT ĐẶT HÀNG
        </span>
        <h2 className="text-xl font-serif font-bold text-zinc-950 mt-0.5">Tài Chính & Đặt Cọc</h2>
      </div>

      <div className="space-y-3.5 text-xs font-sans mb-6">
        <div className="flex justify-between text-zinc-600">
          <span>Tổng giá niêm yết:</span>
          <span className="font-mono font-bold text-zinc-900">{subtotal.toLocaleString('vi-VN')} đ</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Ưu đãi thành viên:</span>
          <span className="font-mono font-bold text-amber-600">-0 đ</span>
        </div>
      </div>

      {/* Box tiền cọc */}
      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-center mb-6">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase font-bold tracking-wider">
          <span>🔒 TỔNG CỌC CẦN THANH TOÁN:</span>
          <span className="text-zinc-950">{totalVehiclesCount} Xe</span>
        </div>
        <div className="text-3xl font-extrabold font-mono text-zinc-950 py-1">
          {totalDeposit > 0 ? totalDeposit.toLocaleString('vi-VN') : '50.000.000'} đ
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        {step === 1 ? (
          <Button
            onClick={onNextStep}
            className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>TIẾP TỤC ĐẾN BƯỚC 3: ĐẶT CỌC</span>
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCompletePayment} // KÍCH HOẠT HÀM TẠO ĐƠN VÀ CHUYỂN TRANG
            className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>XÁC NHẬN CỌC & HOÀN TẤT</span>
            <ArrowRight className="size-4" />
          </Button>
        )}

        <button
          onClick={onPrevStep}
          className="w-full h-11 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-semibold text-[11px] tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>QUAY LẠI {step === 1 ? 'GIỎ HÀNG' : 'CHỈNH SỬA HỒ SƠ'}</span>
        </button>
      </div>
    </div>
  );
};