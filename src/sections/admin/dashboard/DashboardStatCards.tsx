import React, { useState, useEffect } from 'react';
import { DollarSign, Car, FileText, Users } from 'lucide-react';

interface DashboardStatCardsProps {
  totalRevenue: number;
  completedOrdersCount: number;
  processingOrdersCount: number;
  totalCustomersCount: number;
  isLoading?: boolean;
}

const formatBillionVND = (amount: number) => {
  if (!amount || amount === 0) return '0.0';
  const billion = amount / 1_000_000_000;
  return billion.toLocaleString('vi-VN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
};

export const DashboardStatCards: React.FC<DashboardStatCardsProps> = ({
  totalRevenue,
  completedOrdersCount,
  processingOrdersCount,
  totalCustomersCount,
  isLoading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: 'Tổng doanh thu hợp đồng',
      value: formatBillionVND(totalRevenue),
      unit: 'Tỷ VND',
      icon: DollarSign,
      subText: 'Hợp đồng thực tế trong hệ thống',
      badge: 'Doanh thu',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      iconColor: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Xe đã bàn giao',
      value: completedOrdersCount.toString(),
      unit: 'hợp đồng',
      icon: Car,
      subText: 'Hợp đồng đã hoàn thành',
      badge: 'Bàn giao',
      badgeColor: 'bg-blue-100 text-blue-700',
      iconColor: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Đơn cọc đang xử lý',
      value: processingOrdersCount.toString(),
      unit: 'hợp đồng',
      icon: FileText,
      subText: 'Đang giao & chờ giao xe',
      badge: 'Đang xử lý',
      badgeColor: 'bg-amber-100 text-amber-700',
      iconColor: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Tổng khách hàng',
      value: totalCustomersCount.toString(),
      unit: 'tài khoản',
      icon: Users,
      subText: 'Khách hàng đăng ký trên hệ thống',
      badge: 'Khách hàng',
      badgeColor: 'bg-purple-100 text-purple-700',
      iconColor: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm hover:shadow-md flex flex-col justify-between h-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform hover:-translate-y-1 ${
            isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
          style={{ transitionDelay: `${idx * 80}ms` }}
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-zinc-500">{stat.title}</p>
            <div className={`p-2 rounded-xl ${stat.iconColor}`}>
              <stat.icon className="size-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-bold text-zinc-900 tracking-tight">
                {isLoading ? '...' : stat.value}
              </span>
              <span className="text-xs font-medium text-zinc-500">{stat.unit}</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${stat.badgeColor}`}>
                {stat.badge}
              </span>
              <span className="text-[11px] text-zinc-400 truncate">{stat.subText}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
