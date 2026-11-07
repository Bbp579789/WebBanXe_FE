
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
 * Lấy danh sách xe công khai có phân trang
 * GET /api/v1/vehicles/public?page=1&limit=10
 */
export const getVehicles = async (
  params: { page: number; limit: number }
): Promise<VehiclesResponse> => {
  const response = await api.get<VehiclesResponse>(
    "/vehicles/public",
    {
      params: {
        page: params.page,
        limit: params.limit,
      },
    }
  );

  return response.data;
};

/**
 * Lấy thông tin chi tiết xe công khai theo ID
 */
export const getVehicleById = async (
  id: number
): Promise<Vehicle> => {
  const response = await api.get(
    `/vehicles/public/${id}`
  );

  return response.data.data;
};

// import api from "../axios";
// import type { Vehicle } from "../../../types";

// interface VehiclesResponse {
//   message: string;
//   status: number;
//   data: Vehicle[];
//   pagination: {
//     limit: number;
//     page: number;
//     total: number;
//     totalPages: number;
//   };
// }

// /**
//  * Lấy danh sách xe công khai
//  * GET /api/v1/vehicles/public
//  */
// export const getVehicles = async (p0: { page: number; limit: number; }): Promise<Vehicle[]> => {
//   const response = await api.get<VehiclesResponse>("/vehicles/public");

//   return response.data.data;
// };

// /**
//  * Lấy thông tin chi tiết xe công khai theo ID
//  * GET /api/v1/vehicles/public/:id
//  */
// export const getVehicleById = async (
//   id: number
// ): Promise<Vehicle> => {
//   const response = await api.get(
//     `/vehicles/public/${id}`
//   );

//   return response.data.data;
// };