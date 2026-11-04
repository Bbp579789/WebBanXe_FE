
// import React from "react";

// import { useVNPayReturn } from "../../hooks/useVNPayReturn";
// import { VNPaySuccessSection } from "../../sections/payment-return/VNPaySuccessSection";
// import { VNPayFailureSection } from "../../sections/payment-return/VNPayFailureSection";

// const VNPayReturnPage: React.FC = () => {
//   const { transaction, isSuccess } = useVNPayReturn();

//   return (
//     <>
//       {isSuccess ? (
//         <VNPaySuccessSection transaction={transaction} />
//       ) : (
//         <VNPayFailureSection transaction={transaction} />
//       )}
//     </>
//   );
// };

// export default VNPayReturnPage;



import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import {
  getPaymentByTxnRef,
  type PaymentResponse,
} from '../../services/api/user/paymentUserService';

export const VNPayReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const txnRef = searchParams.get('vnp_TxnRef');
  const responseCode = searchParams.get('vnp_ResponseCode');

  const [payment, setPayment] =
    useState<PaymentResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const verifyPayment = async () => {
      if (!txnRef) {
        setError('Không tìm thấy mã giao dịch VNPay.');
        setLoading(false);
        return;
      }

      try {
        const result = await getPaymentByTxnRef(txnRef);

        if (active) {
          setPayment(result);
        }
      } catch (err) {
        console.error('Get payment status error:', err);

        if (active) {
          setError(
            'Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại sau.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    verifyPayment();

    return () => {
      active = false;
    };
  }, [txnRef]);

  const isSuccess = payment?.status === 'success';

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-5">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg">

        {loading ? (
          <>
            <Loader2 className="mx-auto mb-5 size-12 animate-spin text-[#b8955a]" />
            <h1 className="text-xl font-bold">
              Đang xác minh thanh toán
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Vui lòng đợi hệ thống kiểm tra giao dịch.
            </p>
          </>
        ) : error ? (
          <>
            <AlertCircle className="mx-auto mb-5 size-12 text-amber-500" />
            <h1 className="text-xl font-bold">
              Chưa thể xác minh giao dịch
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              {error}
            </p>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="mx-auto mb-5 size-16 text-emerald-500" />
            <h1 className="text-2xl font-bold text-zinc-900">
              Thanh toán thành công
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Giao dịch đã được hệ thống xác nhận.
            </p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-5 size-16 text-red-500" />
            <h1 className="text-2xl font-bold text-zinc-900">
              Thanh toán chưa thành công
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Mã phản hồi VNPay: {responseCode || 'Không xác định'}
            </p>
          </>
        )}

        {payment && (
          <div className="mt-6 space-y-3 rounded-xl bg-zinc-50 p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-zinc-500">Mã giao dịch</span>
              <span className="font-semibold">{payment.txn_ref}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-zinc-500">Số tiền</span>
              <span className="font-semibold">
                {Number(payment.amount || 0).toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-zinc-500">Trạng thái</span>
              <span className="font-semibold">{payment.status}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/order"
            className="rounded-xl bg-[#b8955a] px-5 py-3 font-semibold text-white"
          >
            Xem đơn hàng
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-zinc-200 px-5 py-3 font-semibold"
          >
            Về trang chủ
          </Link>
        </div>
      </section>
    </main>
  );
};

export default VNPayReturnPage;
