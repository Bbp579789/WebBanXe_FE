
import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-zinc-50 font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Nội dung bên phải */}
      <main className="ml-64 min-w-0 flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
