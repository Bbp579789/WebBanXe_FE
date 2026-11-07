export type PaymentMethod = "vnpay" | "bank_transfer";

export interface CustomerForm {
  customer_name: string;
  phone: string;
  email: string;
  note: string;
}

export type FormErrors = Partial<Record<keyof CustomerForm, string>>;
