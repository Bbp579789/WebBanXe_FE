import React, { useState, useEffect } from 'react';
import { DollarSign, Car, FileText, AlertTriangle } from 'lucide-react';

export const DashboardStatCards: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Kích hoạt sau tiêu đề một chút
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { title: 'Doanh thu tháng', value: '48.6', unit: 'Tỷ VND', icon: DollarSign, trend: '+14.2%', trendLabel: 'so với tháng trước', color: 'bg-emerald-100 text-emerald-700' },
    { title: 'Xe đã bàn giao', value: '28', unit: 'xe', icon: Car, trend: '+6 xe', trendLabel: 'tiến độ đạt 112% KPI', color: 'bg-emerald-100 text-emerald-700' },
    { title: 'Đơn cọc đang xử lý', value: '15', unit: 'hợp đồng', icon: FileText, subText: '5 đơn chờ duyệt bảo lãnh', badge: 'Đang thẩm định', badgeColor: 'bg-blue-100 text-blue-700' },
    { title: 'Cảnh báo tồn kho', value: '4', unit: 'dòng xe dưới ngưỡng', icon: AlertTriangle, subText: 'GLC 300, C 200, Maybach S 680', badge: 'Cần nhập thêm', badgeColor: 'bg-orange-100 text-orange-700', iconColor: 'text-orange-500 bg-orange-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className={`bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm hover:shadow-md flex flex-col justify-between h-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform hover:-translate-y-1 ${
            isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
          style={{ transitionDelay: `${idx * 100}ms` }}
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-zinc-500">{stat.title}</p>
            <div className={`p-2 rounded-xl ${stat.iconColor || 'bg-zinc-50 text-zinc-700'}`}>
              <stat.icon className="size-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</span>
              <span className="text-xs font-medium text-zinc-500">{stat.unit}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {stat.trend && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${stat.color}`}>{stat.trend}</span>}
              {stat.badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${stat.badgeColor}`}>{stat.badge}</span>}
              <span className="text-[10px] text-zinc-400">{stat.trendLabel || stat.subText}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};