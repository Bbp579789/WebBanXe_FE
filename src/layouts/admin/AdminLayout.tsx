
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import adminAuthService from "../../services/api/admin/adminAuthService";

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

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
