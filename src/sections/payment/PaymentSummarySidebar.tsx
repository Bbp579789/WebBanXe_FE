import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useCart } from "../../hooks/useCart";

interface Props {
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  deliveryMethod: "atelier" | "home";
}

export const PaymentSummarySidebar: React.FC<Props> = ({
  step,
  onNextStep,
  onPrevStep,
  deliveryMethod,
}) => {
  const { cartItems, subtotal } = useCart();

  const vehicleCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  return (
    <aside className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs sticky top-24">
      <div className="border-b border-zinc-100 pb-4 mb-4">
        <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
          BẢN TÓM TẮT ĐẶT HÀNG
        </span>
        <h2 className="text-xl font-serif font-bold text-zinc-950 mt-0.5">
          Tài Chính & Đặt Cọc
        </h2>
      </div>

      <div className="space-y-3.5 text-xs font-sans mb-6">
        <div className="flex justify-between text-zinc-600">
          <span>Tổng giá niêm yết:</span>
          <span className="font-mono font-bold text-zinc-900">
            {Number(subtotal || 0).toLocaleString("vi-VN")} đ
          </span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Số lượng xe:</span>
          <span className="font-mono font-bold text-zinc-900">{vehicleCount}</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Phương thức nhận xe:</span>
          <span className="font-semibold text-zinc-900">
            {deliveryMethod === "atelier" ? "Atelier Lounge" : "Tại nhà"}
          </span>
        </div>
        {deliveryMethod === "home" && (
          <div className="flex justify-between text-zinc-600">
            <span>Phí giao xe dự kiến:</span>
            <span className="font-mono font-bold text-zinc-900">
              3.000.000 đ
            </span>
          </div>
        )}
      </div>

      {/* <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-center mb-6">
        <div className="text-[11px] font-mono text-zinc-500 uppercase font-bold tracking-wider">
          SỐ TIỀN ĐẶT CỌC
        </div>
        <div className="text-xl font-bold text-zinc-900 py-1">
          Được tính bởi hệ thống
        </div>
        <p className="text-[10px] text-zinc-500">
          Số tiền chính thức được backend xác định khi tạo hợp đồng.
        </p>
      </div> */}

      <div className="space-y-3">
        {step === 1 ? (
          <Button
            type="button"
            onClick={onNextStep}
            disabled={cartItems.length === 0}
            className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <span>TIẾP TỤC ĐẾN BƯỚC ĐẶT CỌC</span>
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <p className="text-center text-xs text-zinc-500">
            Kiểm tra thông tin trước khi tạo hợp đồng và chuyển đến VNPay.
          </p>
        )}

        <button
          type="button"
          onClick={onPrevStep}
          className="w-full h-11 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-semibold text-[11px] tracking-wider uppercase flex items-center justify-center gap-2 transition"
        >
          <ArrowLeft className="size-4" />
          <span>{step === 1 ? "QUAY LẠI GIỎ HÀNG" : "QUAY LẠI CHỈNH SỬA HỒ SƠ"}</span>
        </button>
      </div>
    </aside>
  );
};

export default PaymentSummarySidebar;
