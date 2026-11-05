// export type CustomerMembership = 'maybach_club' | 'diamond' | 'platinum' | 'standard';

// export type CustomerStatus = 'active' | 'locked' | 'pending';

// export interface AdminCustomer {
//   id: string; 
//   fullName: string;
//   phone: string;
//   email: string;
//   idCard: string;
//   address: string;
//   membership: CustomerMembership;
//   interestedCar: string;
//   joinDate: string;
//   status: CustomerStatus;
//   notes?: string;
//   avatarText?: string;
// }

// export interface MembershipConfig {
//   label: string;
//   badgeBg: string;
//   badgeText: string;
//   badgeBorder: string;
//   iconColor: string;
// }



// export type CustomerStatus =
//   | 'potential'
//   | 'interested'
//   | 'deposited'
//   | 'completed'
//   | 'cancelled';

// export interface Customer {
//   id: number;
//   username?: string;
//   full_name: string;
//   phone: string;
//   email: string;
//   role: 'customer';

//   interested_vehicle?: string | null;
//   deposited_vehicle?: string | null;

//   created_at: string;
//   status?: CustomerStatus;
// }

// export interface CustomerListResponse {
//   message?: string;
//   status?: number;
//   data: Customer[];
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }


export type CustomerMembership =
  | "maybach_club"
  | "diamond"
  | "platinum"
  | "standard";

export type CustomerStatus = "active" | "locked";

export interface BackendCustomer {
  id: number;
  username: string;
  full_name?: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "sales";
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminCustomer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  idCard: string;
  address: string;
  membership: CustomerMembership;
  interestedCar: string;
  joinDate: string;
  status: CustomerStatus;
  notes: string;
  avatarText: string;
}

export interface CreateCustomerPayload {
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  role: "customer";
}

export interface UpdateCustomerPayload {
  full_name: string;
  email: string;
  phone: string;
  address?: string;
}