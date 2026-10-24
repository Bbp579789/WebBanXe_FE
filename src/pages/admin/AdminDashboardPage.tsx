import React from 'react';
// import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardTitle } from '../../sections/admin/dashboard/DashboardTitle';
import { DashboardStatCards } from '../../sections/admin/dashboard/DashboardStatCards';
import { DashboardCharts } from '../../sections/admin/dashboard/DashboardCharts';
import { DashboardRecentOrders } from '../../sections/admin/dashboard/DashboardRecentOrders';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* Header thanh công cụ trên cùng */}
      {/* <AdminHeader /> */}

      {/* Khung chứa các Section chính */}
      <main className="p-8 overflow-hidden space-y-6">
        <DashboardTitle />
        <DashboardStatCards />
        <DashboardCharts />
        <DashboardRecentOrders />
      </main>
    </div>
  );
};

export default AdminDashboardPage;