
import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Home,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  Receipt,
} from "lucide-react";

import type { TransactionInfo } from "../../types/paymentReturn";
import {
  formatCurrency,
  formatPayDate,
  decodeOrderInfo,
} from "../../utils/paymentReturnUtils";

import { TransactionDetailSection } from "./TransactionDetailSection";

interface Props {
  transaction: TransactionInfo;
}

export const VNPaySuccessSection: React.FC<Props> = ({
  transaction,
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-16 select-none">
      <div className="w-full max-w-lg">
        <div className="rounded-[32px] border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-8 sm:p-10 text-center shadow-2xl shadow-emerald-500/5">

          <div className="relative mx-auto mb-8 size-24">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />

            <div className="relative size-24 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="size-12 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            Thanh Toán Thành Công!
          </h1>

          <p className="text-sm text-zinc-400 mb-8 max-w-sm mx-auto">
            Đặt cọc của Quý khách đã được xác nhận. Đội ngũ Mercedes-Benz sẽ liên hệ trong 24 giờ.
          </p>

          <div className="rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5 sm:p-6 text-left space-y-3 mb-8">

            <div className="flex items-center gap-2 border-b border-zinc-700/40 pb-3 mb-1">
              <Receipt className="size-4 text-[#b8955a]" />

              <span className="text-[10px] font-mono text-[#b8955a] uppercase tracking-widest font-bold">
                Chi tiết giao dịch
              </span>
            </div>

            <TransactionDetailSection
              label="Mã giao dịch VNPAY"
              value={transaction.transactionNo}
              highlight
            />

            <TransactionDetailSection
              label="Mã đơn hàng"
              value={transaction.txnRef}
            />

            <TransactionDetailSection
              label="Số tiền đặt cọc"
              value={formatCurrency(transaction.amount)}
              highlight
            />

            <TransactionDetailSection
              label="Ngân hàng"
              value={transaction.bankCode}
            />

            <TransactionDetailSection
              label="Thời gian"
              value={formatPayDate(transaction.payDate)}
            />

            <TransactionDetailSection
              label="Nội dung"
              value={decodeOrderInfo(transaction.orderInfo)}
            />

            <div className="pt-3 border-t border-zinc-700/40">
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono font-bold">
                <ShieldCheck className="size-3.5" />
                <span>GIAO DỊCH THÀNH CÔNG • MÃ: 00</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/order"
              className="w-full h-12 rounded-xl bg-[#b8955a] hover:bg-[#a3834c] text-zinc-950 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition"
            >
              <ClipboardList className="size-4" />
              <span>XEM LỊCH SỬ ĐƠN HÀNG</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/"
              className="w-full h-11 rounded-xl bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Home className="size-4" />
              <span>VỀ TRANG CHỦ</span>
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] text-zinc-600 mt-6 font-mono">
          Email xác nhận đã được gửi đến hộp thư của Quý khách
        </p>
      </div>
    </div>
  );
};
