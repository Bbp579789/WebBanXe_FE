
// import { apiClient } from './apiClient';

// export interface CreateDepositPayload {
//   vehicle_id: number;
//   deposit_amount: number;
//   customer_name: string;
//   phone: string;
//   email: string;
//   note?: string;
// }

// export interface VnpayPaymentResponse {
//   status?: string;
//   message?: string;
//   data?: {
//     payment_url?: string;
//     paymentUrl?: string;
//     payment_link?: string;
//     order_id?: string;
//     [key: string]: unknown;
//   };
//   payment_url?: string;
//   paymentUrl?: string;
//   payment_link?: string;
//   order_id?: string;
//   [key: string]: unknown;
// }

// export const createDepositOrder = async (
//   payload: CreateDepositPayload
// ): Promise<VnpayPaymentResponse> => {
//   const response = await apiClient.post<VnpayPaymentResponse>(
//     '/payments/vnpay',
//     payload
//   );

//   return response as unknown as VnpayPaymentResponse;
// };

// const orderUserService = {
//   createDepositOrder,
// };

// export default orderUserService;
