import React from 'react';
import { AdminBrandingPanel } from '../../sections/admin/admin-auth/AdminBrandingPanel';
import { AdminLoginForm } from '../../sections/admin/admin-auth/AdminLoginForm';

export const AdminLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full overflow-hidden bg-white">
      {/* Cột trái: Thương hiệu & Ảnh nền */}
      <AdminBrandingPanel />

      {/* Cột phải: Form nhập liệu đăng nhập */}
      <AdminLoginForm />
    </div>
  );
};

export default AdminLoginPage;