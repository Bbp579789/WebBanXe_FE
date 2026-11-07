import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { TransactionInfo } from "../types/paymentReturn";

export const useVNPayReturn = () => {
  const [searchParams] = useSearchParams();

  const transaction = useMemo<TransactionInfo>(() => {
    const amountRaw = searchParams.get("vnp_Amount");
    const amountNumber = Number(amountRaw);

    return {
      txnRef: searchParams.get("vnp_TxnRef") ?? "",

      amount:
        amountRaw && Number.isFinite(amountNumber) && amountNumber >= 0
          ? amountNumber / 100
          : 0,

      bankCode: searchParams.get("vnp_BankCode") ?? "",
      orderInfo: searchParams.get("vnp_OrderInfo") ?? "",
      payDate: searchParams.get("vnp_PayDate") ?? "",
      transactionNo: searchParams.get("vnp_TransactionNo") ?? "",

      responseCode: searchParams.get("vnp_ResponseCode") ?? "99",
    };
  }, [searchParams]);

  const transactionStatus = searchParams.get(
    "vnp_TransactionStatus"
  );

  const isSuccess =
    transaction.responseCode === "00" &&
    transactionStatus === "00";

  return {
    transaction,
    isSuccess,
  };
};

// import { useMemo } from "react";
// import { useSearchParams } from "react-router-dom";
// import type { TransactionInfo } from "../types/paymentReturn";

// export const useVNPayReturn = () => {
//   const [searchParams] = useSearchParams();

//   const transaction = useMemo<TransactionInfo>(() => {
//     const amountRaw = searchParams.get("vnp_Amount");
//     const amountNumber = Number(amountRaw);

//     return {
//       txnRef: searchParams.get("vnp_TxnRef") ?? "",
//       amount:
//         amountRaw && Number.isFinite(amountNumber) && amountNumber >= 0
//           ? amountNumber / 100
//           : 0,
//       bankCode: searchParams.get("vnp_BankCode") ?? "",
//       orderInfo: searchParams.get("vnp_OrderInfo") ?? "",
//       payDate: searchParams.get("vnp_PayDate") ?? "",
//       transactionNo: searchParams.get("vnp_TransactionNo") ?? "",
//       responseCode: searchParams.get("vnp_ResponseCode") ?? "99",
//     };
//   }, [searchParams.toString()]);

//   const isSuccess = transaction.responseCode === "00";

//   return {
//     transaction,
//     isSuccess,
//   };
// };