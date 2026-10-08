export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

// ==========================================
// 1. DATABASE ENTITIES (KHỚP ERD)
// ==========================================

export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'MAINTENANCE';
export type TestDriveStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type UserRole = 'CUSTOMER' | 'SALES' | 'ACCOUNTANT' | 'ADMIN';
export type PurchaseType = 'FULL_PAYMENT' | 'INSTALLMENT' | 'DEPOSIT';

export interface Vehicle {
  id: number;
  vin: string;
  engine_no: string;
  brand: string;
  model: string;
  year: number;
  exterior_color: string;
  interior_color: string;
  cost_price: number;
  price: number;
  status: VehicleStatus;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  full_name: string;
  role: UserRole;
  address?: string;
}

export interface TestDrive {
  id: number;
  user_id: number;
  vehicle_id: number;
  driver_license_no: string;
  scheduled_at: string;
  timeline: number; // 1: Sáng, 2: Chiều
  status: TestDriveStatus;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  vehicle_id: number;
  quantity: number;
  vehicle?: Vehicle;
}

// ==========================================
// 2. UI EXTENDED TYPES (HIỂN THỊ SHOWCASE)
// ==========================================

export interface VehicleCardItem extends Vehicle {
  badge_top: string;
  badge_sub?: string;
  category_label: string;
  location_status: string;
  description: string;
  image_url: string;
  specs: { label: string; value: string }[];
  deposit_amount: number;
}

export interface TestDriveFormData {
  user_name: string;
  phone: string;
  driver_license_no: string;
  vehicle_id: number;
  scheduled_at?: string;
  timeline?: number;
  note?: string;
}