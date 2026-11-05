import type {
  AdminCustomer,
  BackendCustomer,
} from "../../../types/adminCustomer.types";

export const getBackendId = (id: string): number => {
  return Number(id.replace("MB-CUST-", ""));
};

export const mapBackendCustomer = (
  user: BackendCustomer
): AdminCustomer => {
  const fullName = user.full_name || user.username || "Chưa cập nhật";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(-2)
    .join("")
    .toUpperCase();

  return {
    id: `MB-CUST-${user.id}`,
    fullName,
    phone: user.phone || "Chưa cập nhật",
    email: user.email || "Chưa cập nhật",
    idCard: "Chưa có dữ liệu",
    address: user.address || "Chưa cập nhật",
    membership: "standard",
    interestedCar: "Chưa có dữ liệu",
    joinDate: user.created_at
      ? new Date(user.created_at).toLocaleDateString("vi-VN")
      : "Chưa cập nhật",
    status: "active",
    notes: "",
    avatarText: initials || "KH",
  };
};