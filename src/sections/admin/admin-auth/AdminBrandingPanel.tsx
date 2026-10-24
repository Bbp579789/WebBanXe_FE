import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Car } from 'lucide-react';
import { Icon } from '../../../components/ui/icon';

export const AdminBrandingPanel: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative lg:w-1/2 bg-zinc-950 text-white p-10 lg:p-16 flex flex-col justify-between overflow-hidden min-h-[600px] lg:min-h-screen">
      
      {/* ẢNH NỀN CHÌM - Hiệu ứng Zoom out chậm */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/src/assets/image/admin_banner.png"
          alt="Maybach Background"
          className={`w-full h-full object-cover opacity-35 transition-transform duration-[3000ms] ease-out ${
            isMounted ? 'scale-105' : 'scale-110'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      {/* HEADER LOGO - Trượt từ trên xuống */}
      <div 
        className={`relative z-10 flex items-center gap-3 transition-all duration-1000 delay-300 transform ${
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}
      >
        <div className="size-8 rounded-full border border-[#b8955a] p-1 text-[#b8955a]">
            <Icon name="logo" className="size-full" />
          </div>
        <div>
          <h2 className="text-sm font-serif tracking-[0.2em] text-white font-bold">MERCEDES-BENZ</h2>
          <p className="text-[9px] font-mono tracking-widest text-[#b8955a]">AUTHORIZED DEALER PORTAL</p>
        </div>
      </div>

      {/* NỘI DUNG CHÍNH - Xuất hiện nối tiếp nhau */}
      <div className="relative z-10 my-auto space-y-8 py-10">
        
        {/* Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-1000 delay-500 transform ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="size-1.5 rounded-full bg-[#b8955a]" />
          <span className="text-[10px] font-mono tracking-wider text-zinc-300 uppercase">HỆ THỐNG ĐIỀU HÀNH NỘI BỘ</span>
        </div>

        {/* Tiêu đề chính - Trượt từ trái sang */}
        <h1 
          className={`text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white transition-all duration-1000 delay-[600ms] transform ${
            isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          The Best or <span className="text-[#b8955a] italic">Nothing</span>
        </h1>

        {/* Mô tả */}
        <div 
          className={`space-y-3 text-xs text-zinc-400 font-sans max-w-md leading-relaxed transition-all duration-1000 delay-700 transform ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-semibold text-zinc-200">Hệ thống Quản trị & Vận hành Đại lý Ủy quyền</p>
          <p>Nền tảng quản lý tập trung dành riêng cho ban giám đốc, tư vấn bán hàng và bộ phận dịch vụ kỹ thuật tiêu chuẩn toàn cầu.</p>
        </div>

        {/* Danh sách tính năng */}
        <div 
          className={`space-y-2.5 text-xs text-zinc-300 font-mono transition-all duration-1000 delay-[800ms] transform ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-default">
            <Car className="size-4 text-[#b8955a]" />
            <span>Quản lý danh mục xe sang & số khung VIN</span>
          </div>
          <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-default">
            <Cpu className="size-4 text-[#b8955a]" />
            <span>Điều phối xưởng dịch vụ kỹ thuật số</span>
          </div>
          <div className="flex items-center gap-2.5 hover:text-white transition-colors cursor-default">
            <ShieldCheck className="size-4 text-[#b8955a]" />
            <span>Bảo mật dữ liệu chuẩn ISO/IEC 27001</span>
          </div>
        </div>

        {/* Card Flagship - Nổi lên và scale nhẹ */}
        <div 
          className={`p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex items-center justify-between transition-all duration-1000 delay-1000 transform ${
            isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          } hover:border-zinc-600 hover:bg-zinc-800/80 cursor-default`}
        >
          <div>
            <span className="text-[9px] font-mono text-[#b8955a] uppercase tracking-widest block">FLAGSHIP SHOWCASE</span>
            <h4 className="text-sm font-serif font-bold text-white mt-0.5">Mercedes-Maybach S 680 4MATIC</h4>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Động cơ V12 Biturbo • Đỉnh cao chế tác thủ công Sovereign</p>
          </div>
        </div>
      </div>

      {/* FOOTER - Hiện ra từ từ */}
      <div 
        className={`relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/10 pt-4 transition-all duration-1000 delay-[1200ms] transform ${
          isMounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span>Mercedes-Benz Vietnam Ltd.</span>
        <span className="text-[#b8955a]">Dealer Management System v4.8 Pro</span>
      </div>
      
    </div>
  );
};