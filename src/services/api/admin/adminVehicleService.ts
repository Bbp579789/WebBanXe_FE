import { apiClient } from "../admin/apiClient";

import type {
  Vehicle,
  VehicleAsset,
  CreateVehiclePayload,
  UpdateVehiclePayload,
} from "../../../types/adminVehicle.types";

const VEHICLES_ENDPOINT = "/vehicles";

function extractPayload<T>(response: any): T {
  let result = response;

  // apiClient có thể đã trả về response.data
  if (result?.data !== undefined) {
    result = result.data;
  }

  // Một số API trả về { status, message, data }
  if (
    result &&
    typeof result === "object" &&
    result.data !== undefined
  ) {
    result = result.data;
  }

  return result as T;
}

function extractVehicleList(response: any): Vehicle[] {
  const result = extractPayload<any>(response);

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.vehicles)) {
    return result.vehicles;
  }

  if (Array.isArray(result?.items)) {
    return result.items;
  }

  return [];
}

export const adminVehicleService = {
  /**
   * Lấy danh sách xe dành cho Admin
   */
  getAll: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get(VEHICLES_ENDPOINT);
    return extractVehicleList(response);
  },

  /**
   * Lấy thông tin chi tiết xe
   */
  getById: async (id: number): Promise<Vehicle> => {
    const response = await apiClient.get(
      `${VEHICLES_ENDPOINT}/${id}`
    );

    return extractPayload<Vehicle>(response);
  },

  /**
   * Thêm xe
   */
  create: async (
    payload: CreateVehiclePayload
  ): Promise<Vehicle> => {
    const response = await apiClient.post(
      VEHICLES_ENDPOINT,
      payload
    );

    return extractPayload<Vehicle>(response);
  },

  /**
   * Cập nhật xe
   */
  update: async (
    id: number,
    payload: UpdateVehiclePayload
  ): Promise<Vehicle> => {
    const response = await apiClient.put(
      `${VEHICLES_ENDPOINT}/${id}`,
      payload
    );

    return extractPayload<Vehicle>(response);
  },

  /**
   * Xóa xe
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${VEHICLES_ENDPOINT}/${id}`);
  },

  /**
   * Lấy danh sách tài sản của xe
   */
  getAssets: async (
    vehicleId: number
  ): Promise<VehicleAsset[]> => {
    const response = await apiClient.get(
      `${VEHICLES_ENDPOINT}/${vehicleId}/assets`
    );

    const result = extractPayload<any>(response);

    if (Array.isArray(result)) {
      return result;
    }

    if (Array.isArray(result?.assets)) {
      return result.assets;
    }

    return [];
  },

  /**
   * Upload ảnh hoặc tài liệu của xe.
   *
   * Lưu ý: tên field multipart phải khớp Swagger Backend.
   */
  uploadAsset: async (
    vehicleId: number,
    file: File,
    assetType: "image" | "document"
  ): Promise<VehicleAsset> => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("asset_type", assetType);

    const response = await apiClient.post(
      `${VEHICLES_ENDPOINT}/${vehicleId}/assets`,
      formData,
      {
        headers: {
          "Content-Type": undefined as unknown as string,
        },
      }
    );

    return extractPayload<VehicleAsset>(response);
  },

  /**
   * Xóa tài sản theo ID
   */
  deleteAsset: async (assetId: number): Promise<void> => {
    await apiClient.delete(
      `${VEHICLES_ENDPOINT}/assets/${assetId}`
    );
  },
};

export default adminVehicleService;