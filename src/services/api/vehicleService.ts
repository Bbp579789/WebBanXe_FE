import { apiClient } from './apiClient';
import type { VehicleCardItem, Vehicle } from '../../types';

export const vehicleService = {
  // Đổi thành /vehicles/public để không bị chặn quyền 403
  getAllVehicles: async (): Promise<VehicleCardItem[]> => {
    const res: any = await apiClient.get('/vehicles/public');
    return Array.isArray(res) ? res : res?.data || [];
  },

  getVehicleById: async (id: number | string): Promise<Vehicle> => {
    const res: any = await apiClient.get(`/vehicles/${id}`);
    return res?.data || res;
  },
};

export default vehicleService;