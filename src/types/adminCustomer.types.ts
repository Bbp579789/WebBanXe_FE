export type CustomerMembership = 'maybach_club' | 'diamond' | 'platinum' | 'standard';

export type CustomerStatus = 'active' | 'locked' | 'pending';

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
  notes?: string;
  avatarText?: string;
}

export interface MembershipConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconColor: string;
}
