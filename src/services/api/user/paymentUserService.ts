// import { apiClient } from './apiClient';

// export interface CreateVNPayPayload {
//   contractId: number;
// }

// export interface VNPayResponse {
//   paymentUrl?: string;
//   payment_url?: string;
//   url?: string;
//   data?: VNPayResponse | string;
// }

// export interface PaymentResponse {
//   id?: number;
//   contract_id?: number;
//   txn_ref?: string;
//   vnp_transaction_no?: string;
//   amount?: number;
//   method?: string;
//   status?: 'pending' | 'success' | 'failed' | 'cancelled';
//   paid_at?: string | null;
//   created_at?: string;
// }

// /**
//  * Tạo URL thanh toán VNPay từ hợp đồng
//  * POST /api/v1/payments/vnpay
//  */
// export async function createVNPayUrl(
//   contractId: number
// ): Promise<VNPayResponse | string> {
//   if (!contractId || !Number.isInteger(contractId) || contractId <= 0) {
//     throw new Error(`Contract ID không hợp lệ: ${contractId}`);
//   }

//   const payload: CreateVNPayPayload = {
//     contractId: Number(contractId),
//   };

//   console.log("VNPay request URL:", "/payments/vnpay");
//   console.log("VNPay request body:", payload);

//   try {
//     const response = await apiClient.post<VNPayResponse | string>(
//       "/payments/vnpay",
//       payload
//     );

//     console.log("VNPay response:", response.data);

//     return response.data;
//   } catch (error: any) {
//     console.error("VNPay API error:", {
//       status: error.response?.status,
//       data: error.response?.data,
//       requestBody: payload,
//     });

//     throw error;
//   }
// }

// /**
//  * Lấy danh sách thanh toán
//  * GET /api/v1/payments
//  */
// export async function getAllPayments(): Promise<PaymentResponse[]> {
//   const response = await apiClient.get('/payments');
//   return response.data;
// }

// /**
//  * Lấy danh sách thanh toán theo hợp đồng
//  * GET /api/v1/payments/contract/{contractId}
//  */
// export async function getPaymentsByContract(
//   contractId: number
// ): Promise<PaymentResponse[]> {
//   const response = await apiClient.get(
//     `/payments/contract/${contractId}`
//   );

//   return response.data;
// }

// /**
//  * Lấy thanh toán theo mã giao dịch
//  * GET /api/v1/payments/txnRef/{txnRef}
//  */
// export async function getPaymentByTxnRef(
//   txnRef: string
// ): Promise<PaymentResponse> {
//   const response = await apiClient.get(
//     `/payments/txnRef/${encodeURIComponent(txnRef)}`
//   );

//   return response.data;
// }

// /**
//  * Lấy thanh toán theo ID
//  * GET /api/v1/payments/{id}
//  */
// export async function getPaymentById(
//   id: number
// ): Promise<PaymentResponse> {
//   const response = await apiClient.get(`/payments/${id}`);
//   return response.data;
// }



import { apiClient } from "./apiClient";

export interface CreateVNPayPayload {
  contractId: number;
}

export interface VNPayResponse {
  paymentUrl?: string;
  payment_url?: string;
  url?: string;
  data?: VNPayResponse | string;
}

export interface PaymentResponse {
  id?: number;
  contract_id?: number;
  txn_ref?: string;
  vnp_transaction_no?: string;
  amount?: number;
  method?: string;
  status?: "pending" | "success" | "failed" | "cancelled";
  paid_at?: string | null;
  created_at?: string;
}

// POST /api/v1/payments/vnpay
export async function createVNPayUrl(
  contractId: number
): Promise<VNPayResponse | string> {
  if (!Number.isInteger(contractId) || contractId <= 0) {
    throw new Error(`Contract ID không hợp lệ: ${contractId}`);
  }

  const payload: CreateVNPayPayload = { contractId };

  try {
    // apiClient đã unwrap response.data trong interceptor
    const response = await apiClient.post<
      VNPayResponse | string
    >("/payments/vnpay", payload);

    console.log("VNPay response:", response);

    return response as unknown as VNPayResponse | string;
  } catch (error: any) {
    console.error("VNPay API error:", {
      status: error.response?.status,
      data: error.response?.data,
      requestBody: payload,
    });

    throw error;
  }
}

// GET /api/v1/payments
export async function getAllPayments(): Promise<PaymentResponse[]> {
  const response = await apiClient.get<PaymentResponse[]>("/payments");
  return response as unknown as PaymentResponse[];
}

// GET /api/v1/payments/contract/{contractId}
export async function getPaymentsByContract(
  contractId: number
): Promise<PaymentResponse[]> {
  const response = await apiClient.get<PaymentResponse[]>(
    `/payments/contract/${contractId}`
  );

  return response as unknown as PaymentResponse[];
}

// GET /api/v1/payments/txnRef/{txnRef}
export async function getPaymentByTxnRef(
  txnRef: string
): Promise<PaymentResponse> {
  const response = await apiClient.get<PaymentResponse>(
    `/payments/txnRef/${encodeURIComponent(txnRef)}`
  );

  return response as unknown as PaymentResponse;
}

// GET /api/v1/payments/{id}
export async function getPaymentById(
  id: number
): Promise<PaymentResponse> {
  const response = await apiClient.get<PaymentResponse>(
    `/payments/${id}`
  );

  return response as unknown as PaymentResponse;
}
