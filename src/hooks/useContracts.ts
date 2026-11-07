
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { getMyContracts } from "../services/api/user/contractService";
import type { Contract } from "../types/contract";

export function useContracts() {
  const navigate = useNavigate();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Kiểm tra đăng nhập và tự động đồng bộ danh sách hợp đồng
  useEffect(() => {
    const userName = localStorage.getItem("userName");

    if (!userName) {
      navigate("/");

      setTimeout(() => {
        window.dispatchEvent(new Event("openLoginDialog"));
      }, 300);

      setLoading(false);
      return;
    }

    let isMounted = true;
    let isFetching = false;

    const fetchContracts = async () => {
      // Tránh gọi API chồng chéo khi lần trước chưa hoàn thành
      if (isFetching) return;

      isFetching = true;

      try {
        const data = await getMyContracts();

        if (isMounted) {
          console.log("CONTRACTS ARRAY:", data);

          setContracts(Array.isArray(data) ? data : []);
        }
      } catch (error: any) {
        console.error(
          "Lỗi lấy danh sách hợp đồng:",
          error.response?.data || error
        );
      } finally {
        isFetching = false;

        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Tải dữ liệu ngay khi mở trang
    fetchContracts();

    // Tự động đồng bộ sau mỗi 10 giây
    const interval = window.setInterval(fetchContracts, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [navigate]);

  // Lọc hợp đồng
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      switch (activeFilter) {
        case "pending":
          return contract.contract_status === "pending";

        case "active":
          return contract.contract_status === "active";

        case "shipping":
          return contract.delivery_state === "shipping";

        case "delivered":
          return contract.delivery_state === "delivered";

        case "completed":
          return contract.contract_status === "completed";

        case "cancelled":
          return (
            contract.contract_status === "cancelled" ||
            contract.delivery_state === "cancelled"
          );

        default:
          return true;
      }
    });
  }, [contracts, activeFilter]);

  // Thống kê số lượng
  const counts = useMemo(() => ({
    all: contracts.length,

    pending: contracts.filter(
      (c) => c.contract_status === "pending"
    ).length,

    active: contracts.filter(
      (c) => c.contract_status === "active"
    ).length,

    shipping: contracts.filter(
      (c) => c.delivery_state === "shipping"
    ).length,

    delivered: contracts.filter(
      (c) => c.delivery_state === "delivered"
    ).length,

    completed: contracts.filter(
      (c) => c.contract_status === "completed"
    ).length,

    cancelled: contracts.filter(
      (c) =>
        c.contract_status === "cancelled" ||
        c.delivery_state === "cancelled"
    ).length,
  }), [contracts]);

  return {
    contracts,
    filteredContracts,
    activeFilter,
    setActiveFilter,
    counts,
    loading,
  };
}
