/* =========================================
   VEHICLE ENUMS
========================================= */

// Trạng thái xe trong Database
export type VehicleStatus = "available" | "new";

// Trạng thái hiển thị trên giao diện Admin
export type VehicleSaleStatus = "selling" | "hidden";

// Phân khúc xe phục vụ giao diện
export type VehicleSegment = "Maybach" | "AMG" | "Sedan" | "SUV";

/* =========================================
   VEHICLE - BACKEND DATABASE
========================================= */

// Khớp với bảng vehicles trong PostgreSQL
export interface Vehicle {
  id: number;

  vin: string;
  engine_no: string;

  brand: string;
  model: string;
  year: number;

  image_url: string | null;

  exterior_color: string;
  interior_color: string;

  import_price: number;
  percentage_profit: number;
  price: number;

  variant: string;
  description: string | null;

  engine: string | null;
  power_hp: number | null;
  torque_nm: number | null;
  acceleration: number | null;
  top_speed: number | null;

  fuel: string | null;
  transmission: string | null;
  drivetrain: string | null;
  seats: number | null;

  status: VehicleStatus;

  created_at: string;
  updated_at: string | null;
}

/* =========================================
   VEHICLE ASSETS
========================================= */

export type VehicleAssetType = "image" | "document";

export type VehicleResourceType = "image" | "raw" | "video";

export interface VehicleAsset {
  id: number;
  vehicle_id: number;

  asset_type: VehicleAssetType;
  url: string;
  public_id: string;

  resource_type: VehicleResourceType;
  format: string | null;
  bytes: number;

  original_filename: string;
  created_at: string;
}

/* =========================================
   ADMIN VEHICLE
   Dữ liệu dùng để hiển thị trong Admin
========================================= */

export interface AdminVehicle {
  id: string;

  name: string;
  description: string;

  modelCode: string;
  segment: VehicleSegment;

  price: number;
  stock: number;

  status: VehicleSaleStatus;

  imageUrl: string;

  year: number;
  engine: string;

  exteriorColor: string;
  interiorColor: string;
}

/* =========================================
   CREATE / UPDATE VEHICLE
========================================= */

export interface CreateVehiclePayload {
  vin: string;
  engine_no: string;

  brand: string;
  model: string;
  year: number;

  exterior_color: string;
  interior_color: string;

  import_price: number;
  percentage_profit: number;
  price: number;

  variant: string;
  description?: string | null;

  engine?: string | null;
  power_hp?: number | null;
  torque_nm?: number | null;
  acceleration?: number | null;
  top_speed?: number | null;

  fuel?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  seats?: number | null;

  status?: VehicleStatus;
}

export type UpdateVehiclePayload =
  Partial<CreateVehiclePayload>;

/* =========================================
   PRODUCT CATEGORY
   Dữ liệu phân loại phục vụ Admin
========================================= */

export interface ProductCategory {
  id: string;
  code: string;
  name: string;

  segment: VehicleSegment;

  description: string;

  vehicleCount: number;
  totalStock: number;

  status: "active" | "inactive";
}

/* =========================================
   GOODS RECEIPT
========================================= */

// Khớp với bảng goods_receipts
export interface GoodsReceipt {
  id: number;
  supplier_name: string;
  total_cost: number;
  note: string | null;
  created_at: string;
}

// Khớp với bảng goods_receipt_details
export interface GoodsReceiptDetail {
  id: number;
  goods_receipt_id: number;
  vehicle_id: number;
  unit_cost: number;
  note: string | null;
}

/* =========================================
   IMPORT RECEIPT
   Dữ liệu hiển thị trên Admin
========================================= */

export interface ImportReceipt {
  id: string;
  importDate: string;
  supplier: string;

  vehicleName: string;
  modelCode: string;

  quantity: number;

  unitCost: number;
  totalAmount: number;

  warehouse: string;

  status: "completed" | "draft";
  inspector: string;
}

/* =========================================
   PRICING CONFIGURATION
========================================= */

export interface PricingConfigItem {
  id: string;

  vehicleName: string;
  modelCode: string;

  segment: VehicleSegment;

  baseCost: number;
  listedPrice: number;

  registrationTaxPercent: number;
  dealerMarginPercent: number;

  promotionDiscount: number;

  updatedAt: string;
}