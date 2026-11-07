import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Contract } from '../../../types/adminContract.types';

interface DashboardRecentOrdersProps {
  contracts: Contract[];
  isLoading?: boolean;
}

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (isoString?: string) => {
  if (!isoString) return 'Chưa rõ';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        label: 'Hoàn thành',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'active':
      return {
        label: 'Đang giao xe',
        className: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
      };
    case 'pending':
      return {
        label: 'Chờ duyệt / cọc',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'cancelled':
      return {
        label: 'Đã hủy',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: status || 'Chưa rõ',
        className: 'bg-zinc-100 text-zinc-700 border-zinc-200',
        dot: 'bg-zinc-400',
      };
  }
};

export const DashboardRecentOrders: React.FC<DashboardRecentOrdersProps> = ({
  contracts,
  isLoading,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 450);
    return () => clearTimeout(timer);
  }, []);

  // Lấy 5 đơn gần nhất
  const recentOrders = contracts.slice(0, 5);

  return (
    <div
      className={`bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
            Hợp Đồng & Đơn Hàng Gần Đây
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Dữ liệu thực tế các giao dịch đặt cọc và hợp đồng từ hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/orders')}
          className="h-9 px-4 text-xs rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white hover:text-[#b8955a] font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <span>Xem tất cả đơn</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
              <th className="pb-3.5 pl-4 font-semibold">Mã HĐ</th>
              <th className="pb-3.5 px-3 font-semibold">Ngày tạo</th>
              <th className="pb-3.5 px-3 font-semibold">Khách Hàng (User ID)</th>
              <th className="pb-3.5 px-3 font-semibold">Mẫu xe</th>
              <th className="pb-3.5 px-3 font-semibold text-right">Tổng giá trị</th>
              <th className="pb-3.5 px-3 font-semibold text-right">Tiền đặt cọc</th>
              <th className="pb-3.5 px-4 font-semibold text-center">Trạng Thái</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400 font-medium">
                  Đang tải danh sách hợp đồng...
                </td>
              </tr>
            ) : recentOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="size-8 text-zinc-300" />
                    <p className="font-medium text-zinc-600">Chưa có hợp đồng nào được tạo</p>
                  </div>
                </td>
              </tr>
            ) : (
              recentOrders.map((contract) => {
                const statusBadge = getStatusBadge(contract.contract_status);
                const vehicle = contract.contractDetails?.[0];
                const vehicleTitle = vehicle
                  ? `${vehicle.brand} ${vehicle.model} ${vehicle.variant || ''}`.trim()
                  : 'Xe đặt cọc';

                return (
                  <tr
                    key={contract.id}
                    onClick={() => navigate('/admin/orders')}
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 pl-4 font-mono font-bold text-zinc-900 group-hover:text-[#b8955a] transition-colors">
                      #{contract.id}
                    </td>

                    <td className="py-4 px-3 font-medium text-zinc-600">
                      {formatDate(contract.created_at)}
                    </td>

                    <td className="py-4 px-3 font-bold text-zinc-800">
                      User #{contract.user_id}
                    </td>

                    <td className="py-4 px-3 font-medium text-zinc-800 max-w-[200px] truncate">
                      {vehicleTitle}
                    </td>

                    <td className="py-4 px-3 font-bold text-zinc-900 text-right whitespace-nowrap">
                      {formatCurrency(contract.total_amount)}
                    </td>

                    <td className="py-4 px-3 font-semibold text-emerald-700 text-right whitespace-nowrap">
                      {formatCurrency(contract.deposit)}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge.className}`}
                      >
                        <span className={`size-1.5 rounded-full ${statusBadge.dot}`} />
                        {statusBadge.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
