import React, { useState } from 'react';
import { LayoutDashboard, Car, FileText, Users, MessageSquare, LogOut, ChevronUp } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../services/api/admin/adminAuthService';
import { Icon } from '../ui/icon';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Admin Mercedes';
  
  // State để quản lý việc ẩn/hiện menu Đăng xuất
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Quản lý sản phẩm', path: '/admin/vehicles', icon: Car },
    { name: 'Đơn hàng', path: '/admin/orders', icon: FileText },
    { name: 'Khách hàng', path: '/admin/customers', icon: Users },
    { name: 'Chat Message', path: '/admin/chat', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-zinc-800/50 z-50">
      
      {/* LOTO & THƯƠNG HIỆU (Căn giữa, ngay ngắn) */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-zinc-800/50">
        <div className="size-10 shrink-0 rounded-full border border-[#b8955a] p-1.5 text-[#b8955a] flex items-center justify-center bg-zinc-950 shadow-[0_0_15px_rgba(184,149,90,0.1)]">
          <Icon name="logo" className="size-full" />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-[13px] font-serif tracking-[0.15em] text-white font-bold leading-tight">MERCEDES-BENZ</h2>
          <p className="text-[8.5px] font-mono tracking-widest text-[#b8955a] mt-0.5">AUTHORIZED PORTAL</p>
        </div>
      </div>

      {/* MENU CHÍNH */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-mono text-zinc-500 px-2 mb-4 uppercase tracking-wider">Hệ thống điều hành</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-zinc-900/80 text-[#b8955a] font-medium border border-[#b8955a]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
              }`
            }
          >
            <item.icon className="size-4" />
            <span>{item.name}</span>
            <span className="ml-auto opacity-0 [.active_&]:opacity-100 size-1.5 rounded-full bg-[#b8955a]" />
          </NavLink>
        ))}
      </div>

      {/* USER PROFILE & LOGOUT MENU */}
      <div className="relative p-4 border-t border-zinc-800/50">
        
        {/* Pop-up Menu (Về trang chủ / Đăng xuất) */}
        {isUserMenuOpen && (
          <div className="absolute bottom-[calc(100%-8px)] left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left"
            >
              <div className="size-4 text-[#b8955a]">
                <Icon name="logo" className="size-full" />
              </div>
              <span className="text-xs font-medium text-zinc-300">Về trang chủ</span>
            </button>
            
            <div className="h-px w-full bg-zinc-800/80" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left group"
            >
              <LogOut className="size-4 text-zinc-400 group-hover:text-rose-500 transition-colors" />
              <span className="text-xs font-medium text-zinc-400 group-hover:text-rose-500 transition-colors">Đăng xuất</span>
            </button>
          </div>
        )}

        {/* Nút User Profile (Bấm vào để mở Pop-up) */}
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${
            isUserMenuOpen ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'
          }`}
        >
          <div className="size-10 shrink-0 rounded-xl bg-gradient-to-br from-[#b8955a] to-[#8a6e3d] text-black font-bold flex items-center justify-center shadow-lg">
            {adminName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <h4 className="text-sm font-bold text-white truncate">{adminName}</h4>
            <p className="text-[10px] text-zinc-400">admin@mercedes.vn</p>
          </div>
          <ChevronUp 
            className={`size-4 text-zinc-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
      </div>
    </aside>
  );
};