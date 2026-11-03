export type AdminOrderStatus =
  | 'all'
  | 'completed'
  | 'delivering'
  | 'cancelled'
  | 'deposited';

export interface AdminOrder {
  id: string; // e.g. MB-ORD-2026-001
  createdDate: string; // e.g. 2026-09-15
  customerName: string;
  customerPhone: string;
  customerIdCard: string;
  customerEmail: string;
  deliveryAddress: string;

  carModel: string;
  carColor: string;
  vin: string;
  engineNo: string;
  manufactureYear: string;
  salesAdvisor: string;

  contractValue: number; // e.g. 15990000000
  registrationFee: number;
  insuranceFee: number;
  discount: number;
  totalValue: number; // contractValue + registrationFee + insuranceFee + discount
  paidAmount: number;
  remainingAmount: number;

  status: Exclude<AdminOrderStatus, 'all'>;
  timelineStep: 1 | 2 | 3 | 4;
}

export interface StatusConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
}
