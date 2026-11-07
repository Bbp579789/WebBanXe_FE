import { CreditCard, Landmark } from "lucide-react";
import type { PaymentMethod } from "../../types/checkout";

interface Props {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSection = ({ value, onChange }: Props) => {
  const cardClass = (selected: boolean) =>
    `relative p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
      selected
        ? "border-[#b8955a] bg-[#b8955a]/5 shadow-lg shadow-[#b8955a]/5"
        : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"
    }`;

  return (
    <section className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-mono font-bold text-zinc-300 rounded">03</span>
        <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">Phương thức thanh toán</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button type="button" onClick={() => onChange("vnpay")} className={cardClass(value === "vnpay")}>
          {value === "vnpay" && <span className="absolute top-3 right-3 size-5 rounded-full bg-[#b8955a] text-zinc-950 flex items-center justify-center">✓</span>}
          <CreditCard className={`size-7 mb-3 ${value === "vnpay" ? "text-[#b8955a]" : "text-zinc-500"}`} />
          <h3 className={`text-sm font-bold mb-1 ${value === "vnpay" ? "text-white" : "text-zinc-400"}`}>VNPAY - ATM / QR Code</h3>
          <p className="text-[10px] text-zinc-500 leading-relaxed">Thanh toán trực tuyến qua thẻ ATM, QR Code hoặc ví VNPAY. Xác nhận tức thì.</p>
        </button>

        <button type="button" onClick={() => onChange("bank_transfer")} className={cardClass(value === "bank_transfer")}>
          {value === "bank_transfer" && <span className="absolute top-3 right-3 size-5 rounded-full bg-[#b8955a] text-zinc-950 flex items-center justify-center">✓</span>}
          <Landmark className={`size-7 mb-3 ${value === "bank_transfer" ? "text-[#b8955a]" : "text-zinc-500"}`} />
          <h3 className={`text-sm font-bold mb-1 ${value === "bank_transfer" ? "text-white" : "text-zinc-400"}`}>Chuyển khoản qua Đại lý</h3>
          <p className="text-[10px] text-zinc-500 leading-relaxed">Chuyển khoản trực tiếp qua ngân hàng đến tài khoản đại lý Mercedes-Benz.</p>
        </button>
      </div>
    </section>
  );
};
