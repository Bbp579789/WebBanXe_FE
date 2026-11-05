
import api from "../axios";
import type { Contract } from "../../../types/contract";

// POST /api/v1/contracts
export const createContract = async (data: {
  vehicle_ids: number[];
  shipping_address: string;
  purchase_type: "cash" | "transaction";
  description?: string;
}) => {
  const response = await api.post("/contracts", data);
  return response.data;
};

// GET /api/v1/contracts
// Lấy tất cả hợp đồng (Admin)
export const getAllContracts = async () => {
  const response = await api.get("/contracts");
  return response.data;
};

// GET /api/v1/contracts/me
// Lấy hợp đồng của user hiện tại
// export const getMyContracts = async (): Promise<Contract[]> => {
//   const response = await api.get("/contracts/me");
//   return response.data.data;
// };

export const getMyContracts = async (): Promise<Contract[]> => {
  const response = await api.get("/contracts/me");

  console.log("MY CONTRACTS RESPONSE:", response);

  // API trả về { data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // API trả về trực tiếp [...]
  if (Array.isArray(response)) {
    return response;
  }

  // API có thể bọc thêm một lớp data
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  console.warn("Không tìm thấy danh sách hợp đồng:", response);

  return [];
};

// GET /api/v1/contracts/:id
export const getContractById = async (
  id: number
): Promise<Contract> => {
  const response = await api.get(`/contracts/${id}`);
  return response.data.data;
};

// PUT /api/v1/contracts/:id
export const updateContract = async (
  id: number,
  data: Partial<Contract>
) => {
  const response = await api.put(`/contracts/${id}`, data);
  return response.data;
};

// DELETE /api/v1/contracts/:id
export const deleteContract = async (id: number) => {
  const response = await api.delete(`/contracts/${id}`);
  return response.data;
};
