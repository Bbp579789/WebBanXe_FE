import React from 'react';
// import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardTitle } from '../../sections/admin/dashboard/DashboardTitle';
import { DashboardStatCards } from '../../sections/admin/dashboard/DashboardStatCards';
import { DashboardCharts } from '../../sections/admin/dashboard/DashboardCharts';
import { DashboardRecentOrders } from '../../sections/admin/dashboard/DashboardRecentOrders';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="flex-1 h-full overflow-y-auto min-h-0 bg-zinc-50">
      {/* Khung chứa các Section chính */}
      <main className="p-8 pb-16 space-y-6">
        <DashboardTitle />
        <DashboardStatCards />
        <DashboardCharts />
        <DashboardRecentOrders />
      </main>
    </div>
  );
};

export default AdminDashboardPage;