export type PurchaseType = "cash" | "transaction";

export type ContractStatus =
  | "pending"
  | "active"
  | "completed"
  | "cancelled";

export type DeliveryState =
  | "in_progress"
  | "shipping"
  | "delivered"
  | "cancelled";

// Thông tin xe trong hợp đồng
export interface ContractDetail {
  id: number;
  image_url: string;
  brand: string;
  model: string;
  year: number;
  exterior_color?: string;
  interior_color?: string;
  price: string;
  variant?: string;
  description?: string;
  engine?: string;
  power_hp?: number;
  torque_nm?: number;
  acceleration?: string;
  top_speed?: number;
  fuel?: string;
  transmission?: string;
  drivetrain?: string;
  seats?: number;
  status?: string;
}

// Hợp đồng
export interface Contract {
  id: number;
  user_id: number;
  shipping_address: string;
  purchase_type: PurchaseType;
  description?: string;
  total_amount: string;
  deposit: string;
  contract_status: ContractStatus;
  delivery_state: DeliveryState;
  signed_at?: string | null;
  delivery_date?: string | null;
  created_at: string;
  updated_at?: string;
  contractDetails: ContractDetail[];
}

// Payload tạo hợp đồng
export interface CreateContractPayload {
  vehicle_ids: number[];
  shipping_address: string;
  purchase_type: PurchaseType;
  description?: string;
}

// Payload cập nhật hợp đồng
export interface UpdateContractPayload {
  shipping_address?: string;
  purchase_type?: PurchaseType;
  description?: string;
  contract_status?: ContractStatus;
  delivery_state?: DeliveryState;
  delivery_date?: string | null;
  signed_at?: string | null;
}

// API response
export interface ContractListResponse {
  message: string;
  status: number;
  data: Contract[];
}

export interface ContractDetailResponse {
  message: string;
  status: number;
  data: Contract;
}

// Xe đã đặt cọc hiển thị trong Customer Admin
export interface DepositedCar {
  contractId: number;
  imageUrl: string;
  brand: string;
  model: string;
  variant?: string;
  year?: number;
  deposit: string;
  totalAmount: string;
  contractStatus: ContractStatus;
  createdAt: string;
}
