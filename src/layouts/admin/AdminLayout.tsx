import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      {/* Khung bên trái (Cố định) */}
      <AdminSidebar />
      
      {/* Khung nội dung bên phải */}
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};