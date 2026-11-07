import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export interface MonthlyRevenue {
  name: string;
  value: number; // Tỷ VNĐ
}

export interface SegmentDistribution {
  name: string;
  value: number;
  color: string;
}

interface DashboardChartsProps {
  revenueData: MonthlyRevenue[];
  segmentData: SegmentDistribution[];
  isLoading?: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  revenueData,
  segmentData,
  isLoading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const totalSegmentCars = segmentData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* BIỂU ĐỒ 1: XU HƯỚNG DOANH THU */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
              Xu Hướng Doanh Thu Hợp Đồng
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Đơn vị tính: Tỷ Đồng (VNĐ) • Tổng hợp từ hợp đồng thực tế
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
            <span className="w-3.5 h-1 rounded-full bg-[#b8955a]" />
            Doanh thu thực tế
          </div>
        </div>

        <div className="h-[260px] w-full mt-2">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-sm text-zinc-400">
              Đang tải biểu đồ doanh thu...
            </div>
          ) : revenueData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-zinc-400">
              Chưa có dữ liệu doanh thu hợp đồng.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#71717a' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#71717a' }}
                  tickFormatter={(val) => `${val} tỷ`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #e4e4e7',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#b8955a', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value} Tỷ VNĐ`, 'Doanh thu']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#b8955a"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#b8955a', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#b8955a', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* BIỂU ĐỒ 2: CƠ CẤU XE THEO PHÂN KHÚC */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
            Cơ Cấu Xe Trong Hệ Thống
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Tổng {totalSegmentCars} xe phân bổ theo dòng
          </p>
        </div>

        <div className="h-[210px] w-full relative flex items-center justify-center my-2">
          {isLoading ? (
            <span className="text-xs text-zinc-400">Đang tải phân khúc...</span>
          ) : totalSegmentCars === 0 ? (
            <span className="text-xs text-zinc-400">Chưa có dữ liệu xe</span>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e4e4e7',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [`${value} xe`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Label trung tâm Donut */}
          {!isLoading && totalSegmentCars > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                {totalSegmentCars}
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Tổng xe
              </span>
            </div>
          )}
        </div>

        {/* Chú thích dòng xe */}
        <div className="space-y-2 mt-2">
          {segmentData.map((item, idx) => {
            const percent = totalSegmentCars > 0
              ? Math.round((item.value / totalSegmentCars) * 100)
              : 0;

            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-600 font-medium truncate max-w-[130px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-900 font-bold">{item.value} xe</span>
                  <span className="text-zinc-400 text-[11px] w-9 text-right font-mono">
                    {percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
