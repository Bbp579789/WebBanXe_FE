import React, { useState, useEffect } from 'react';

export const DashboardTitle: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const currentDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(new Date());

  return (
    <div 
      className={`flex items-end justify-between mb-2 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div>
        {/* <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
          <span>Đại lý Mercedes-Benz</span>
          <span>/</span>
          <span className="text-[#b8955a] font-bold">Dashboard Tổng quan</span>
        </div> */}
        <h1 className="text-3xl font-serif font-bold text-zinc-900 tracking-tight">Dashboard Tổng Quan</h1>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200/80 rounded-full shadow-sm">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-500">{currentDate}</span>
      </div>
    </div>
  );
};