export type VehicleSegment = 'Maybach' | 'AMG' | 'Sedan' | 'SUV';

export type VehicleSaleStatus = 'selling' | 'hidden';

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

export interface ProductCategory {
  id: string;
  code: string;
  name: string;
  segment: VehicleSegment;
  description: string;
  vehicleCount: number;
  totalStock: number;
  status: 'active' | 'inactive';
}

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
  status: 'completed' | 'draft';
  inspector: string;
}

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

