import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 font-sans">
      {/* Khung bên trái (Cố định w-64) */}
      <AdminSidebar />
      
      {/* Khung nội dung bên phải (chiếm toàn bộ phần còn lại) */}
      <div className="flex-1 ml-64 h-full flex flex-col overflow-hidden min-w-0">
        <Outlet />
      </div>
    </div>
  );
};