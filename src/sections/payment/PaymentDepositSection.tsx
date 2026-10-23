import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Banknote, ShieldCheck, X, Loader2 } from 'lucide-react';
import { cartService } from '../../services/api/cartService';
import { orderService } from '../../services/api/orderService';

export const PaymentDepositSection: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Khởi tạo giá trị null để mặc định chưa chọn phương thức nào
  const [method, setMethod] = useState<'vnpay' | 'cash' | null>(null);
  
  // 2. Các State quản lý Popup VNPay
  const [showVnpayPopup, setShowVnpayPopup] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  // Hàm xử lý khi click chọn VNPay
  const handleSelectVnpay = async () => {
    setMethod('vnpay');
    setShowVnpayPopup(true);

    // Nếu đã có QR rồi thì không gọi lại API nữa để tránh giật lag
    if (!qrData) {
      setLoadingQr(true);
      try {
        // Dùng setTimeout để giả lập thời gian chờ Backend trả về QR Code (1.5 giây)
        setTimeout(() => {
          setQrData('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg');
          setLoadingQr(false);
        }, 1500);

      } catch (error) {
        console.error("Lỗi lấy mã QR từ server", error);
        setLoadingQr(false);
      }
    }
  };

  // 3. HÀM QUAN TRỌNG: Hoàn tất đặt cọc, lưu đơn hàng, dọn giỏ hàng và chuyển sang trang Order
  const handleCompletePayment = () => {
    const cartItems = cartService.getCartItems();
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    // Tính tổng tiền giỏ hàng
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      const vehicleObj = item?.vehicle || item?.car || item;
      const price = Number(vehicleObj?.price) || 0;
      return sum + (price * Number(item.quantity || 1));
    }, 0);
    
    // Lưu đơn hàng chuẩn ERD vào storage của account hiện tại
    orderService.createOrder(cartItems, method === 'vnpay' ? 'VNPAY' : 'CASH', subtotal);

    // Dọn sạch giỏ hàng hiện tại sau khi đã tạo hợp đồng thành công
    cartService.clearCart();
    window.dispatchEvent(new Event('cartChange'));

    // Đóng popup và chuyển hướng sang trang OrderPage
    setShowVnpayPopup(false);
    navigate('/order');
  };

  return (
    <div className="space-y-6">
      {/* 1. Xác nhận xe */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-2 py-1 bg-zinc-100 text-[10px] font-mono font-bold text-zinc-800 rounded">MỤC 01 / 02</span>
          <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">Khóa số VIN</span>
        </div>
        <h2 className="text-xl font-serif font-bold text-zinc-950 mb-1">
          1. Xác Nhận Hồ Sơ Đặt Cọc
        </h2>
        <div className="mt-4 p-4 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
          <ShieldCheck className="size-4 shrink-0" />
          <span>Đã khóa độc quyền số khung VIN trong 14 ngày làm việc trên toàn hệ thống nhà máy Valoir Atelier.</span>
        </div>
      </div>

      {/* 2. Thanh toán */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-2 py-1 bg-zinc-100 text-[10px] font-mono font-bold text-zinc-800 rounded">MỤC 02 / 02</span>
          <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">Ký quỹ bảo lãnh</span>
        </div>
        <h2 className="text-xl font-serif font-bold text-zinc-950 mb-6">2. Phương Thức Thanh Toán Ký Quỹ</h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Nút VNPay */}
          <div 
            onClick={handleSelectVnpay}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition ${method === 'vnpay' ? 'border-zinc-900 bg-white shadow-sm' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'}`}
          >
            <QrCode className={`size-6 mb-2 ${method === 'vnpay' ? 'text-zinc-900' : 'text-zinc-400'}`} />
            <h3 className={`text-sm font-bold ${method === 'vnpay' ? 'text-zinc-900' : 'text-zinc-600'}`}>Chuyển khoản VNPay</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Khớp tự động trong 30 giây</p>
          </div>

          {/* Nút Tiền mặt */}
          <div 
            onClick={() => setMethod('cash')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition ${method === 'cash' ? 'border-zinc-900 bg-white shadow-sm' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'}`}
          >
            <Banknote className={`size-6 mb-2 ${method === 'cash' ? 'text-zinc-900' : 'text-zinc-400'}`} />
            <h3 className={`text-sm font-bold ${method === 'cash' ? 'text-zinc-900' : 'text-zinc-600'}`}>Thanh toán Tiền mặt</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Tại Showroom Atelier</p>
          </div>
        </div>

        {/* Khối hiển thị chi tiết theo Method được chọn (hiển thị trên trang) */}
        <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 min-h-[160px] flex items-center justify-center">
          {!method && (
            <p className="text-sm text-zinc-400">Vui lòng chọn 1 trong 2 phương thức thanh toán ở trên.</p>
          )}

          {method === 'vnpay' && (
            <div className="text-center w-full">
              <QrCode className="size-10 text-zinc-900 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-zinc-900">Đã chọn Chuyển khoản VNPay</h3>
              <p className="text-xs text-zinc-500 mt-2 mb-4">Mã QR đã được tạo cho đơn hàng của bạn.</p>
              <button 
                onClick={() => setShowVnpayPopup(true)}
                className="px-5 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition cursor-pointer"
              >
                Hiển thị lại mã QR
              </button>
            </div>
          )}

          {method === 'cash' && (
            <div className="text-center w-full py-4">
              <Banknote className="size-10 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-900">Thanh toán trực tiếp bằng Tiền mặt</h3>
              <p className="text-xs text-zinc-500 mt-2 mb-4 max-w-sm mx-auto">
                Vui lòng xác nhận đơn hàng, sau đó đến trực tiếp Atelier Lounge để thực hiện thủ tục đóng cọc bằng tiền mặt và ký hợp đồng.
              </p>
              {/* NÚT XÁC NHẬN CHO TIỀN MẶT */}
              {/* <button 
                
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition cursor-pointer"
              >
                Xác Nhận Đặt Hàng (Tiền Mặt)
              </button> */}
            </div>
          )}
        </div>
      </div>

      {/* POPUP HIỂN THỊ MÃ QR VNPAY KHI ĐƯỢC KÍCH HOẠT */}
      {showVnpayPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowVnpayPopup(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[28px] p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Nút đóng Popup */}
            <button 
              onClick={() => setShowVnpayPopup(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-800 transition"
            >
              <X className="size-5" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-serif font-bold text-zinc-900">Quét Mã VNPay</h3>
              <p className="text-xs text-zinc-500 mt-1">Sử dụng App Ngân hàng hoặc VNPay để thanh toán</p>
            </div>

            {loadingQr ? (
              <div className="h-64 flex flex-col items-center justify-center bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
                <Loader2 className="size-8 text-zinc-900 animate-spin mb-3" />
                <p className="text-xs font-medium text-zinc-500">Đang khởi tạo mã QR từ Backend...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-5">
                <div className="size-56 bg-white p-3 rounded-2xl border border-zinc-200 shadow-md">
                  <img src={qrData!} alt="QR VNPay" className="w-full h-full object-contain" />
                </div>
                
                <div className="w-full space-y-3 bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                  <div className="flex justify-between items-center border-b border-zinc-200/60 pb-2">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">Ngân hàng</span>
                    <span className="text-xs font-bold text-zinc-900">Vietcombank - VNPay</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-200/60 pb-2">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">Số tài khoản</span>
                    <span className="text-sm font-mono font-bold text-zinc-900">9999 8888 6868</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">Nội dung</span>
                    <span className="text-xs font-mono font-bold text-[#b8955a] bg-[#b8955a]/10 px-2 py-0.5 rounded">VLX DEP 9921</span>
                  </div>
                </div>

                {/* NÚT KHI ĐÃ QUÉT VÀ THANH TOÁN XONG QUA VNPAY */}
                {/* <button 
            
                  className="w-full h-12 bg-zinc-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition cursor-pointer"
                >
                  Tôi đã thanh toán xong
                </button> */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};