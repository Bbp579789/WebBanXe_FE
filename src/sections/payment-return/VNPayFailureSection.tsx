
import React from "react";
import { Link } from "react-router-dom";
import {
  XCircle,
  Home,
  RotateCcw,
  Receipt,
} from "lucide-react";

import type { TransactionInfo } from "../../types/paymentReturn";
import {
  formatCurrency,
  getErrorMessage,
} from "../../utils/paymentReturnUtils";

import { TransactionDetailSection } from "./TransactionDetailSection";

interface Props {
  transaction: TransactionInfo;
}

export const VNPayFailureSection: React.FC<Props> = ({
  transaction,
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-16 select-none">
      <div className="w-full max-w-lg">
        <div className="rounded-[32px] border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-8 sm:p-10 text-center shadow-2xl shadow-red-500/5">

          <div className="relative mx-auto mb-8 size-24">
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />

            <div className="relative size-24 rounded-full bg-gradient-to-b from-red-500/20 to-red-600/10 border border-red-500/30 flex items-center justify-center">
              <XCircle className="size-12 text-red-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            Thanh Toán Thất Bại
          </h1>

          <p className="text-sm text-zinc-400 mb-4">
            Giao dịch đặt cọc không thể hoàn tất.
          </p>

          <div className="rounded-2xl bg-red-950/20 border border-red-800/30 p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <XCircle className="size-4 text-red-400 shrink-0 mt-0.5" />

              <div>
                <p className="text-xs font-bold text-red-400 mb-1">
                  Lý do: Mã lỗi {transaction.responseCode}
                </p>

                <p className="text-xs text-red-300/70 leading-relaxed">
                  {getErrorMessage(transaction.responseCode)}
                </p>
              </div>
            </div>
          </div>

          {transaction.txnRef && (
            <div className="rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5 text-left space-y-3 mb-8">

              <div className="flex items-center gap-2 border-b border-zinc-700/40 pb-3 mb-1">
                <Receipt className="size-4 text-zinc-500" />

                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                  Thông tin giao dịch
                </span>
              </div>

              <TransactionDetailSection
                label="Mã đơn hàng"
                value={transaction.txnRef}
              />

              {transaction.amount > 0 && (
                <TransactionDetailSection
                  label="Số tiền"
                  value={formatCurrency(transaction.amount)}
                />
              )}

              {transaction.bankCode && (
                <TransactionDetailSection
                  label="Ngân hàng"
                  value={transaction.bankCode}
                />
              )}

              <div className="pt-3 border-t border-zinc-700/40">
                <div className="flex items-center gap-2 text-[10px] text-red-400 font-mono font-bold">
                  <XCircle className="size-3.5" />
                  <span>
                    GIAO DỊCH THẤT BẠI • MÃ: {transaction.responseCode}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full h-12 rounded-xl bg-[#b8955a] hover:bg-[#a3834c] text-zinc-950 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>THỬ LẠI THANH TOÁN</span>
            </button>

            <Link
              to="/vehicles"
              className="w-full h-11 rounded-xl bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <span>XEM CÁC DÒNG XE KHÁC</span>
            </Link>

            <Link
              to="/"
              className="w-full h-11 rounded-xl bg-transparent text-zinc-500 hover:text-zinc-300 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Home className="size-4" />
              <span>VỀ TRANG CHỦ</span>
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] text-zinc-600 mt-6 font-mono">
          Cần hỗ trợ? Liên hệ Hotline:{" "}
          <span className="text-[#b8955a] font-bold">1900 xxxx</span>
        </p>
      </div>
    </div>
  );
};
