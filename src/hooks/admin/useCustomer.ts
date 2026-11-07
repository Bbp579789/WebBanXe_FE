import { useCallback, useEffect, useState } from "react";

import { customerService } from "../../services/api/admin/customerService";
import { mapBackendCustomer } from "../../services/api/admin/adminCustomerMapper";

import type { AdminCustomer } from "../../types/adminCustomer.types";

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("[CRM] Đang tải danh sách khách hàng...");

      const response = await customerService.getCustomers();

      console.log("[CRM] API response:", response);

      setCustomers(response.map(mapBackendCustomer));
    } catch (error: any) {
      console.error("[CRM] Fetch customers error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách khách hàng."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    setCustomers,
  };
};