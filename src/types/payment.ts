
export type DeliveryMethod = "atelier" | "home";

export interface PaymentProfile {
  fullName: string;
  phone: string;
  email: string;
  homeAddress: string;
}

export type PaymentProfileErrors = Partial<
  Record<keyof PaymentProfile, string>
>;

export interface PaymentPageState {
  step: number;
  profile: PaymentProfile;
  deliveryMethod: DeliveryMethod;
  errors: PaymentProfileErrors;
  isProcessing: boolean;
  processingMessage: string;
}
