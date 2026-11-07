import { CreditCard, Landmark, Loader2, ShieldCheck } from "lucide-react";
import type { Vehicle } from "../../types";
import type { PaymentMethod } from "../../types/checkout";
import { formatCurrency } from "../../utils/checkout";

interface Props {
  vehicle: Vehicle;
  paymentMethod: PaymentMethod;
  isProcessing: boolean;
  onVNPay: () => void;
  onBankTransfer: () => void;
  onBack: () => void;
}

export const CheckoutSummarySection = ({
  vehicle, paymentMethod, isProcessing, onVNPay, onBankTransfer, onBack,
}: Props) => {
  const fullName = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
  const price = Number(vehicle.price) || 0;

  return (
    <aside className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 p-6 sm:p-8 sticky top-8">
      <div className="border-b border-zinc-800/60 pb-4 mb-6">
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.25em] font-bold">Tóm tắt đặt cọc</p>
        <h2 className="text-xl font-serif font-bold text-white mt-1">Xác Nhận & Thanh Toán</h2>
      </div>

      <div className="space-y-3 text-xs mb-6">
        <div className="flex justify-between text-zinc-500"><span>Xe đặt cọc</span><span className="text-zinc-300 font-medium text-right max-w-[200px] truncate">{fullName}</span></div>
        <div className="flex justify-between text-zinc-500"><span>Giá niêm yết</span><span className="font-mono font-bold text-zinc-300">{formatCurrency(price)}</span></div>
        <div className="flex justify-between text-zinc-500"><span>Số VIN</span><span className="font-mono text-zinc-300">{vehicle.vin || "—"}</span></div>
        <div className="flex justify-between text-zinc-500"><span>Phương thức</span><span className="text-zinc-300">{paymentMethod === "vnpay" ? "VNPAY" : "Chuyển khoản"}</span></div>
      </div>

      <div className="p-5 rounded-2xl bg-zinc-800/50 border border-zinc-700/40 text-center mb-6">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-2">🔒 Tiền cọc cần thanh toán</p>
        <p className="text-sm font-bold text-[#b8955a]">Số tiền cọc sẽ được backend tính toán</p>
        <p className="text-[10px] text-zinc-600 mt-1">Số tiền chính thức được xác định khi tạo hợp đồng.</p>
      </div>

      <div className="space-y-3">
        {paymentMethod === "vnpay" ? (
          <button type="button" onClick={onVNPay} disabled={isProcessing} className="w-full min-h-13 rounded-xl bg-[#b8955a] hover:bg-[#a3834c] disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition cursor-pointer">
            {isProcessing ? <><Loader2 className="size-4 animate-spin" /> ĐANG XỬ LÝ...</> : <><CreditCard className="size-4" /> TIẾN HÀNH THANH TOÁN VNPAY</>}
          </button>
        ) : (
          <button type="button" onClick={onBankTransfer} disabled={isProcessing} className="w-full min-h-13 rounded-xl bg-[#b8955a] hover:bg-[#a3834c] disabled:opacity-50 text-zinc-950 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition cursor-pointer">
            <Landmark className="size-4" /> LIÊN HỆ ĐẠI LÝ
          </button>
        )}

        <button type="button" onClick={onBack} className="w-full h-11 rounded-xl bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold text-[11px] uppercase tracking-wider transition cursor-pointer">
          ← Quay lại
        </button>
      </div>

      <div className="mt-6 pt-5 border-t border-zinc-800/60 space-y-2">
        {[
          "Giao dịch được bảo mật SSL 256-bit",
          "Đối tác thanh toán chính thức VNPAY",
          "Hoàn cọc theo chính sách và điều khoản hợp đồng",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-[10px] text-zinc-500">
            <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" /><span>{item}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
