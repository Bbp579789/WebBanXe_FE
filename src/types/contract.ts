export interface ContractDetail {
  id: number;
  image_url?: string;
  brand?: string;
  model?: string;
  year?: number;
  vin?: string;
  variant?: string;
  unit_price?: number | string;
  price?: number | string;
}

export interface ContractVehicle {
  vin: any;
  variant: string;
  id: number;
  vehicle_id: number;
  unit_price: number;

  brand?: string;
  model?: string;
  year?: number;
  image_url?: string;
}

export interface Contract {
  id: number;
  user_id: number;

  shipping_address: string;
  purchase_type: "cash" | "transaction";
  description: string | null;

  total_amount: number;
  deposit: number;

  contract_status:
    | "pending"
    | "active"
    | "completed"
    | "cancelled";

  delivery_state:
    | "in_progress"
    | "shipping"
    | "delivered"
    | "cancelled";

  signed_at: string | null;
  delivery_date: string | null;

  created_at: string;
  updated_at: string | null;

  vehicles?: ContractVehicle[];
  contractDetails?: ContractDetail[];
}