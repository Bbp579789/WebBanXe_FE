// import { apiClient } from './apiClient';
// import type { VehicleCardItem, Vehicle } from '../../types';

// export const vehicleService = {
//   // Đổi thành /vehicles/public để không bị chặn quyền 403
//   getAllVehicles: async (): Promise<VehicleCardItem[]> => {
//     const res: any = await apiClient.get('/vehicles/public');
//     return Array.isArray(res) ? res : res?.data || [];
//   },

//   getVehicleById: async (id: number | string): Promise<Vehicle> => {
//     const res: any = await apiClient.get(`/vehicles/${id}`);
//     return res?.data || res;
//   },
// };

// export default vehicleService;


import api from "../axios";
import type { Vehicle } from "../../../types";

interface VehiclesResponse {
  message: string;
  status: number;
  data: Vehicle[];
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Lấy danh sách xe công khai
 * GET /api/v1/vehicles/public
 */
export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get<VehiclesResponse>("/vehicles/public");

  return response.data.data;
};

/**
 * Lấy thông tin chi tiết xe công khai theo ID
 * GET /api/v1/vehicles/public/:id
 */
export const getVehicleById = async (
  id: number
): Promise<Vehicle> => {
  const response = await api.get(
    `/vehicles/public/${id}`
  );

  return response.data.data;
};