import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface DashboardTitleProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const DashboardTitle: React.FC<DashboardTitleProps> = ({ onRefresh, isLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const currentDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div>
        <p className="text-[11px] font-bold text-[#b8955a] uppercase tracking-wider mb-1">
          Hệ thống điều hành / Tổng quan
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Dashboard Tổng Quan
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9 px-3.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200/80 text-zinc-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu từ hệ thống"
          >
            <RotateCcw className={`size-3.5 ${isLoading ? 'animate-spin text-[#b8955a]' : 'text-zinc-500'}`} />
            <span>Làm mới</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-zinc-200/80 rounded-full shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-600 font-medium">
            {currentDate}
          </span>
        </div>
      </div>
    </div>
  );
};
