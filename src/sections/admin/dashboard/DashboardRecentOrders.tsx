import React, { useState, useEffect } from 'react';
import { Filter, Download } from 'lucide-react';

export const DashboardRecentOrders: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => setIsMounted(true), 700);
    return () => clearTimeout(timer);
  }, []);

  const orders = [
    { id: '#MB-2026-089', date: '15/09/2026', customer: 'Trần Hoàng Long', type: 'Khách hàng VIP Kim Cương', avatar: 'TL', car: 'Mercedes-Maybach S 680 4MATIC', color: 'Xanh Nautic Blue / Nội thất Nappa Vàng', deposit: '2.000.000.000 ₫', price: '15.990.000.000 ₫', status: 'Đã cọc', statusColor: 'bg-emerald-500' },
    { id: '#MB-2026-090', date: '15/09/2026', customer: 'Lê Thị Minh Thư', type: 'Khách hàng Doanh nhân', avatar: 'MT', car: 'Mercedes-AMG G 63 V8 Bi-Turbo', color: 'Trắng G manufaktur Opalite / Đỏ Bengal', deposit: '1.500.000.000 ₫', price: '11.750.000.000 ₫', status: 'Đã cọc', statusColor: 'bg-emerald-500' },
    { id: '#MB-2026-091', date: '14/09/2026', customer: 'Công ty CP Đầu tư Đại Nam', type: 'Doanh nghiệp Thân thiết', avatar: 'DN', car: 'Mercedes-Benz S 450 4MATIC Luxury', color: 'Đen Obsidian Black / Da Nappa Nâu Sienna', deposit: '500.000.000 ₫', price: '5.559.000.000 ₫', status: 'Chờ duyệt', statusColor: 'bg-orange-400' },
  ];

  return (
    <div 
      className={`bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Đơn Đặt Cọc Mới Nhất</h3>
          <p className="text-xs text-zinc-500 mt-1">Các hợp đồng đặt cọc xe sang vừa phát sinh</p>
        </div>
       <div className="flex gap-3">
          {/* Nút Lọc đơn */}
          <button 
            type="button"
            className="h-9 px-4 text-xs rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-[#b8955a] text-white hover:text-[#b8955a] font-medium flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer group"
          >
            <Filter className="size-3.5 text-white group-hover:text-[#b8955a] transition-colors" /> 
            <span>Lọc đơn</span>
          </button>
          
          {/* Nút Xuất Excel */}
          <button 
            type="button"
            className="h-9 px-4 text-xs rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-[#b8955a] text-white hover:text-[#b8955a] font-medium flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer group"
          >
            <Download className="size-3.5 text-white group-hover:text-[#b8955a] transition-colors" /> 
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
              <th className="pb-4 pl-4 font-medium">Mã Hợp Đồng</th>
              <th className="pb-4 font-medium">Khách Hàng</th>
              <th className="pb-4 font-medium">Phiên Bản Xe</th>
              <th className="pb-4 font-medium">Tiền Cọc</th>
              <th className="pb-4 font-medium">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 overflow-hidden">
            {orders.map((order, idx) => (
              <tr 
                key={idx} 
                className={`hover:bg-zinc-50/80 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
                  isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
                style={{ transitionDelay: `${200 + idx * 100}ms` }} 
              >
                <td className="py-4 pl-4">
                  <p className="text-xs font-bold text-zinc-900">{order.id}</p>
                </td>
                <td className="py-4">
                  <p className="text-xs font-bold text-zinc-900">{order.customer}</p>
                </td>
                <td className="py-4">
                  <p className="text-xs font-bold text-zinc-900">{order.car}</p>
                </td>
                <td className="py-4">
                  <p className="text-xs font-bold text-[#b8955a]">{order.deposit}</p>
                </td>
                <td className="py-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200/60">
                    <span className={`size-1.5 rounded-full ${order.statusColor} animate-pulse`} />
                    <span className="text-[10px] font-medium text-zinc-600">{order.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};