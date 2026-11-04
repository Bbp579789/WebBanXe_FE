import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Home,
  ClipboardList,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Receipt,
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface TransactionInfo {
  txnRef: string;
  amount: number;
  bankCode: string;
  orderInfo: string;
  payDate: string;
  transactionNo: string;
  responseCode: string;
}

// ==========================================
// HELPERS
// ==========================================

const formatCurrency = (value: number): string => {
  if (isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPayDate = (raw: string): string => {
  // VNPAY trả về dạng "yyyyMMddHHmmss"
  if (!raw || raw.length < 14) return raw || '—';

  const year = raw.substring(0, 4);
  const month = raw.substring(4, 6);
  const day = raw.substring(6, 8);
  const hour = raw.substring(8, 10);
  const minute = raw.substring(10, 12);
  const second = raw.substring(12, 14);

  return `${hour}:${minute}:${second} — ${day}/${month}/${year}`;
};

const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.',
    '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.',
    '11': 'Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch.',
    '12': 'Thẻ/Tài khoản bị khóa.',
    '13': 'Quý khách nhập sai mật khẩu xác thực (OTP).',
    '24': 'Quý khách đã hủy giao dịch.',
    '51': 'Tài khoản không đủ số dư để thực hiện giao dịch.',
    '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng thanh toán đang bảo trì.',
    '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định.',
    '99': 'Lỗi không xác định từ hệ thống.',
  };

  return messages[code] || `Giao dịch không thành công (Mã lỗi: ${code}). Vui lòng thử lại hoặc liên hệ hỗ trợ.`;
};

// ==========================================
// COMPONENT
// ==========================================

export const VNPayReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // ---------- Parse VNPAY params ----------
  const transaction = useMemo<TransactionInfo>(() => {
    const amountRaw = searchParams.get('vnp_Amount') || '0';
    // VNPAY trả amount nhân 100
    const amount = parseInt(amountRaw, 10) / 100;

    return {
      txnRef: searchParams.get('vnp_TxnRef') || '',
      amount,
      bankCode: searchParams.get('vnp_BankCode') || '',
      orderInfo: searchParams.get('vnp_OrderInfo') || '',
      payDate: searchParams.get('vnp_PayDate') || '',
      transactionNo: searchParams.get('vnp_TransactionNo') || '',
      responseCode: searchParams.get('vnp_ResponseCode') || '99',
    };
  }, [searchParams]);

  const isSuccess = transaction.responseCode === '00';

  // ==========================================
  // SUCCESS VIEW
  // ==========================================
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-16 select-none">
        <div className="w-full max-w-lg">
          {/* Success Card */}
          <div className="rounded-[32px] border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-8 sm:p-10 text-center shadow-2xl shadow-emerald-500/5">
            {/* Icon */}
            <div className="relative mx-auto mb-8 size-24">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
              <div className="relative size-24 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="size-12 text-emerald-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              Thanh Toán Thành Công!
            </h1>
            <p className="text-sm text-zinc-400 mb-8 max-w-sm mx-auto">
              Đặt cọc của Quý khách đã được xác nhận. Đội ngũ Mercedes-Benz sẽ liên hệ trong 24 giờ.
            </p>

            {/* Transaction Details */}
            <div className="rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5 sm:p-6 text-left space-y-3 mb-8">
              <div className="flex items-center gap-2 border-b border-zinc-700/40 pb-3 mb-1">
                <Receipt className="size-4 text-[#b8955a]" />
                <span className="text-[10px] font-mono text-[#b8955a] uppercase tracking-widest font-bold">
                  Chi tiết giao dịch
                </span>
              </div>

              <DetailRow label="Mã giao dịch VNPAY" value={transaction.transactionNo} highlight />
              <DetailRow label="Mã đơn hàng" value={transaction.txnRef} />
              <DetailRow label="Số tiền đặt cọc" value={formatCurrency(transaction.amount)} highlight />
              <DetailRow label="Ngân hàng" value={transaction.bankCode} />
              <DetailRow label="Thời gian" value={formatPayDate(transaction.payDate)} />
              <DetailRow label="Nội dung" value={decodeURIComponent(transaction.orderInfo)} />

              <div className="pt-3 border-t border-zinc-700/40">
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono font-bold">
                  <ShieldCheck className="size-3.5" />
                  <span>GIAO DỊCH THÀNH CÔNG • MÃ: 00</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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

          {/* Footer Note */}
          <p className="text-center text-[10px] text-zinc-600 mt-6 font-mono">
            Email xác nhận đã được gửi đến hộp thư của Quý khách
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // FAILURE VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-16 select-none">
      <div className="w-full max-w-lg">
        {/* Error Card */}
        <div className="rounded-[32px] border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-8 sm:p-10 text-center shadow-2xl shadow-red-500/5">
          {/* Icon */}
          <div className="relative mx-auto mb-8 size-24">
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />
            <div className="relative size-24 rounded-full bg-gradient-to-b from-red-500/20 to-red-600/10 border border-red-500/30 flex items-center justify-center">
              <XCircle className="size-12 text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            Thanh Toán Thất Bại
          </h1>
          <p className="text-sm text-zinc-400 mb-4">
            Giao dịch đặt cọc không thể hoàn tất.
          </p>

          {/* Error Reason */}
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

          {/* Transaction Summary */}
          {transaction.txnRef && (
            <div className="rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5 text-left space-y-3 mb-8">
              <div className="flex items-center gap-2 border-b border-zinc-700/40 pb-3 mb-1">
                <Receipt className="size-4 text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                  Thông tin giao dịch
                </span>
              </div>

              <DetailRow label="Mã đơn hàng" value={transaction.txnRef} />
              {transaction.amount > 0 && (
                <DetailRow label="Số tiền" value={formatCurrency(transaction.amount)} />
              )}
              {transaction.bankCode && (
                <DetailRow label="Ngân hàng" value={transaction.bankCode} />
              )}

              <div className="pt-3 border-t border-zinc-700/40">
                <div className="flex items-center gap-2 text-[10px] text-red-400 font-mono font-bold">
                  <XCircle className="size-3.5" />
                  <span>GIAO DỊCH THẤT BẠI • MÃ: {transaction.responseCode}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
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

        {/* Footer Note */}
        <p className="text-center text-[10px] text-zinc-600 mt-6 font-mono">
          Cần hỗ trợ? Liên hệ Hotline:{' '}
          <span className="text-[#b8955a] font-bold">1900 xxxx</span>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

interface DetailRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center">
    <span className="text-[11px] text-zinc-500 uppercase tracking-wide font-bold">
      {label}
    </span>
    <span
      className={`text-xs font-mono font-bold text-right max-w-[55%] truncate ${
        highlight ? 'text-[#b8955a]' : 'text-zinc-300'
      }`}
    >
      {value}
    </span>
  </div>
);

export default VNPayReturnPage;

