import { useCallback, useEffect, useState } from "react";

import { adminVehicleService } from "../../services/api/admin/adminVehicleService";

import type {
  Vehicle,
  CreateVehiclePayload,
  UpdateVehiclePayload,
} from "../../types/adminVehicle.types";

interface UseAdminVehicleReturn {
  vehicles: Vehicle[];

  loading: boolean;
  submitting: boolean;
  error: string | null;

  fetchVehicles: () => Promise<void>;

  createVehicle: (
    payload: CreateVehiclePayload
  ) => Promise<Vehicle>;

  updateVehicle: (
    id: number,
    payload: UpdateVehiclePayload
  ) => Promise<Vehicle>;

  deleteVehicle: (id: number) => Promise<void>;

  getVehicleById: (id: number) => Promise<Vehicle>;

  clearError: () => void;
}

export const useAdminVehicle = (): UseAdminVehicleReturn => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: any): string => {
    return (
      err?.response?.data?.message ||
      err?.message ||
      "Đã xảy ra lỗi khi xử lý dữ liệu xe."
    );
  };

  /**
   * Lấy danh sách xe
   */
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminVehicleService.getAll();

      setVehicles(data);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Thêm xe
   */
  const createVehicle = useCallback(
    async (
      payload: CreateVehiclePayload
    ): Promise<Vehicle> => {
      try {
        setSubmitting(true);
        setError(null);

        const createdVehicle =
          await adminVehicleService.create(payload);

        setVehicles((previous) => [
          createdVehicle,
          ...previous,
        ]);

        return createdVehicle;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  /**
   * Cập nhật xe
   */
  const updateVehicle = useCallback(
    async (
      id: number,
      payload: UpdateVehiclePayload
    ): Promise<Vehicle> => {
      try {
        setSubmitting(true);
        setError(null);

        const updatedVehicle =
          await adminVehicleService.update(id, payload);

        setVehicles((previous) =>
          previous.map((vehicle) =>
            vehicle.id === id
              ? updatedVehicle
              : vehicle
          )
        );

        return updatedVehicle;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  /**
   * Xóa xe
   */
  const deleteVehicle = useCallback(
    async (id: number): Promise<void> => {
      try {
        setSubmitting(true);
        setError(null);

        await adminVehicleService.delete(id);

        setVehicles((previous) =>
          previous.filter((vehicle) => vehicle.id !== id)
        );
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  /**
   * Lấy chi tiết xe
   */
  const getVehicleById = useCallback(
    async (id: number): Promise<Vehicle> => {
      try {
        setError(null);
        return await adminVehicleService.getById(id);
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    void fetchVehicles().catch(() => {
      // Error đã được cập nhật trong fetchVehicles.
    });
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    submitting,
    error,

    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,

    clearError,
  };
};

export default useAdminVehicle;