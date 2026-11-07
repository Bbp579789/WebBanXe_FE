import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardTitle } from '../../sections/admin/dashboard/DashboardTitle';
import { DashboardStatCards } from '../../sections/admin/dashboard/DashboardStatCards';
import { DashboardCharts } from '../../sections/admin/dashboard/DashboardCharts';
import { DashboardRecentOrders } from '../../sections/admin/dashboard/DashboardRecentOrders';

import { contractService } from '../../services/api/admin/adminContractService';
import { adminVehicleService } from '../../services/api/admin/adminVehicleService';
import { customerService } from '../../services/api/admin/customerService';

import type { Contract } from '../../types/adminContract.types';
import type { Vehicle } from '../../types/adminVehicle.types';
import type { BackendCustomer } from '../../types/adminCustomer.types';

export const AdminDashboardPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<BackendCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API lấy dữ liệu thực tế từ hệ thống Backend
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [contractsRes, vehiclesRes, customersRes] = await Promise.allSettled([
        contractService.getAllContracts(),
        adminVehicleService.getAll(),
        customerService.getCustomers(),
      ]);

      if (contractsRes.status === 'fulfilled') {
        // Sắp xếp hợp đồng mới nhất lên đầu
        const sortedContracts = [...contractsRes.value].sort((a, b) => {
          const dateA = new Date(a.created_at || '').getTime();
          const dateB = new Date(b.created_at || '').getTime();
          return dateB - dateA;
        });
        setContracts(sortedContracts);
      }

      if (vehiclesRes.status === 'fulfilled') {
        setVehicles(vehiclesRes.value);
      }

      if (customersRes.status === 'fulfilled') {
        setCustomers(customersRes.value);
      }
    } catch (err: any) {
      console.error('Lỗi tải dữ liệu Dashboard:', err);
      setError('Không thể tải một số dữ liệu từ máy chủ. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ==========================================================
  // TÍNH TOÁN CÁC CHỈ SỐ THỰC TẾ
  // ==========================================================

  // 1. Tổng doanh thu (tổng total_amount của các hợp đồng không bị hủy)
  const totalRevenue = useMemo(() => {
    return contracts
      .filter((c) => c.contract_status !== 'cancelled')
      .reduce((sum, c) => sum + (Number(c.total_amount) || 0), 0);
  }, [contracts]);

  // 2. Xe đã bàn giao (hợp đồng có delivery_state = delivered hoặc status = completed)
  const completedOrdersCount = useMemo(() => {
    return contracts.filter(
      (c) => c.contract_status === 'completed' || c.delivery_state === 'delivered'
    ).length;
  }, [contracts]);

  // 3. Đơn cọc đang xử lý (pending / active / shipping)
  const processingOrdersCount = useMemo(() => {
    return contracts.filter(
      (c) =>
        c.contract_status === 'pending' ||
        c.contract_status === 'active' ||
        c.delivery_state === 'in_progress' ||
        c.delivery_state === 'shipping'
    ).length;
  }, [contracts]);

  // 4. Dữ liệu biểu đồ doanh thu theo các tháng (tính từ hợp đồng thực)
  const monthlyRevenueData = useMemo(() => {
    if (contracts.length === 0) return [];

    // Nhóm theo YYYY-MM
    const map = new Map<string, number>();

    contracts.forEach((c) => {
      if (c.contract_status === 'cancelled' || !c.created_at) return;
      const d = new Date(c.created_at);
      if (Number.isNaN(d.getTime())) return;

      const key = `T${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
      const amount = Number(c.total_amount) || 0;
      map.set(key, (map.get(key) || 0) + amount);
    });

    return Array.from(map.entries()).map(([name, val]) => ({
      name,
      value: Number((val / 1_000_000_000).toFixed(2)),
    }));
  }, [contracts]);

  // 5. Phân bổ xe theo phân khúc thực tế
  const segmentData = useMemo(() => {
    let maybach = 0;
    let amg = 0;
    let suv = 0;
    let sedan = 0;

    vehicles.forEach((v) => {
      const fullText = `${v.brand} ${v.model} ${v.variant || ''}`.toLowerCase();
      if (fullText.includes('maybach')) {
        maybach++;
      } else if (fullText.includes('amg') || fullText.includes('g 63')) {
        amg++;
      } else if (
        fullText.includes('glc') ||
        fullText.includes('gle') ||
        fullText.includes('gls') ||
        fullText.includes('g-class')
      ) {
        suv++;
      } else {
        sedan++;
      }
    });

    return [
      { name: 'Mercedes-Maybach', value: maybach, color: '#b8955a' },
      { name: 'Mercedes-AMG', value: amg, color: '#18181b' },
      { name: 'SUV (GLC, GLE, GLS)', value: suv, color: '#52796f' },
      { name: 'Sedan (C, E, S-Class)', value: sedan, color: '#8b7355' },
    ];
  }, [vehicles]);

  return (
    <div className="flex-1 h-full overflow-y-auto min-h-0 bg-zinc-50 font-sans">
      <main className="p-8 pb-16 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            {error}
          </div>
        )}

        <DashboardTitle onRefresh={loadDashboardData} isLoading={isLoading} />

        <DashboardStatCards
          totalRevenue={totalRevenue}
          completedOrdersCount={completedOrdersCount}
          processingOrdersCount={processingOrdersCount}
          totalCustomersCount={customers.length}
          isLoading={isLoading}
        />

        <DashboardCharts
          revenueData={monthlyRevenueData}
          segmentData={segmentData}
          isLoading={isLoading}
        />

        <DashboardRecentOrders contracts={contracts} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default AdminDashboardPage;
