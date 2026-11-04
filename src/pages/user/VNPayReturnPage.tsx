
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


import React from "react";

import { useVNPayReturn } from "../../hooks/useVNPayReturn";
import { VNPaySuccessSection } from "../../sections/payment-return/VNPaySuccessSection";
import { VNPayFailureSection } from "../../sections/payment-return/VNPayFailureSection";

const VNPayReturnPage: React.FC = () => {
  const { transaction, isSuccess } = useVNPayReturn();

  const hasTransaction = Boolean(
    transaction.txnRef && transaction.responseCode
  );

  if (!hasTransaction) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-zinc-900">
            Không tìm thấy thông tin giao dịch
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            Không nhận được dữ liệu trả về từ VNPay.
            Vui lòng kiểm tra lại giao dịch.
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return isSuccess ? (
    <VNPaySuccessSection transaction={transaction} />
  ) : (
    <VNPayFailureSection transaction={transaction} />
  );
};

export default VNPayReturnPage;