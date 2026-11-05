import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

// Dữ liệu giả lập cho Biểu đồ Doanh thu (12 tháng)
const revenueData = [
  { name: 'T10/25', value: 32 }, { name: 'T11/25', value: 37 },
  { name: 'T12/25', value: 44 }, { name: 'T01/26', value: 29 },
  { name: 'T02/26', value: 35 }, { name: 'T03/26', value: 41 },
  { name: 'T04/26', value: 38 }, { name: 'T05/26', value: 42 },
  { name: 'T06/26', value: 46 }, { name: 'T07/26', value: 43 },
  { name: 'T08/26', value: 46 }, { name: 'T09/26', value: 49 },
];

// Dữ liệu giả lập cho Biểu đồ Phân khúc xe (Donut)
const segmentData = [
  { name: 'Mercedes-Maybach', value: 35, color: '#b8955a' }, // Vàng Gold
  { name: 'Mercedes-AMG', value: 28, color: '#18181b' },     // Đen
  { name: 'SUV (GLC, GLE, GLS)', value: 22, color: '#52796f' }, // Xanh rêu
  { name: 'Sedan (C, E, S-Class)', value: 15, color: '#8b7355' }, // Nâu đồng
];

export const DashboardCharts: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Kích hoạt animation sau khi các thẻ thống kê đã load xong
    const timer = setTimeout(() => setIsMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* =========================================================
          BIỂU ĐỒ 1: XU HƯỚNG DOANH THU (LINE CHART)
          ========================================================= */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-zinc-900">Xu Hướng Doanh Thu 12 Tháng Qua</h3>
            <p className="text-xs text-zinc-500 mt-1">Đơn vị tính: Tỷ Đồng (VNĐ) • Cập nhật theo thời gian thực</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
            <span className="w-4 h-0.5 bg-[#b8955a]"></span>
            Doanh thu đạt chuẩn
          </div>
        </div>
        
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                tickFormatter={(val) => `${val} tỷ`} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: '#b8955a', fontWeight: 'bold' }}
                formatter={(value: any) => [`${value} Tỷ VNĐ`, 'Doanh thu']}
              />
              {/* Đường Line uốn lượn mượt mà (type="monotone") */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#b8955a" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#b8955a', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================================================
          BIỂU ĐỒ 2: PHÂN BỔ DOANH SỐ (DONUT CHART)
          ========================================================= */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm flex flex-col">
        <div>
          <h3 className="text-lg font-serif font-bold text-zinc-900">Phân Bổ Doanh Số Phân Khúc</h3>
          <p className="text-xs text-zinc-500 mt-1">Tỷ trọng doanh thu theo từng dòng xe chủ lực</p>
        </div>

        <div className="h-[180px] w-full mt-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={55} // Tạo lõi rỗng thành hình Donut
                outerRadius={80}
                paddingAngle={3} // Khoảng cách giữa các mảnh
                dataKey="value"
                stroke="none"
                animationDuration={1500}
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
                formatter={(value: any) => [`${value}%`, 'Tỷ trọng']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chú thích (Legend) tự code để căn chỉnh đẹp mắt như bản thiết kế */}
        <div className="mt-auto pt-4 space-y-3">
          {segmentData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-600 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-zinc-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};