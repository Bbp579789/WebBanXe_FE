import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  RotateCcw,
  LayoutDashboard,
  Eye,
  FileText,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
} from 'lucide-react';
import type { AdminOrder, AdminOrderStatus } from '../../types/adminOrder.types';
import { INITIAL_ADMIN_ORDERS, ORDER_STATUS_CONFIG } from '../../data/adminOrdersData';
import { OrderDetailDrawer } from '../../sections/admin/orders/OrderDetailDrawer';

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();

  // Hiệu ứng mở đầu mượt mà giống Dashboard
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Danh sách đơn hàng trong state để có thể cập nhật linh hoạt
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);

  // Bộ lọc
  const [activeStatusTab, setActiveStatusTab] = useState<AdminOrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Drawer chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Định dạng tiền tệ
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Tính số lượng cho từng tab trạng thái
  const counts = useMemo(() => {
    return {
      all: orders.length,
      completed: orders.filter((o) => o.status === 'completed').length,
      delivering: orders.filter((o) => o.status === 'delivering').length,
      deposited: orders.filter((o) => o.status === 'deposited').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  // Lọc danh sách đơn hàng theo điều kiện tìm kiếm, tab trạng thái và khoảng ngày
  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      // Lọc theo tab trạng thái
      if (activeStatusTab !== 'all' && item.status !== activeStatusTab) {
        return false;
      }

      // Lọc theo từ khóa tìm kiếm (mã đơn, tên khách, số điện thoại, xe, phụ trách)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(query);
        const matchCustomer = item.customerName.toLowerCase().includes(query);
        const matchPhone = item.customerPhone.toLowerCase().includes(query);
        const matchCar = item.carModel.toLowerCase().includes(query);
        const matchAdvisor = item.salesAdvisor.toLowerCase().includes(query);

        if (!matchId && !matchCustomer && !matchPhone && !matchCar && !matchAdvisor) {
          return false;
        }
      }

      // Lọc theo ngày bắt đầu (Từ ngày)
      if (fromDate) {
        if (item.createdDate < fromDate) {
          return false;
        }
      }

      // Lọc theo ngày kết thúc (Đến ngày)
      if (toDate) {
        if (item.createdDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeStatusTab, searchQuery, fromDate, toDate]);

  // Tính tổng giá trị của các đơn hàng đang hiển thị
  const totalDisplayValue = useMemo(() => {
    return filteredOrders.reduce((sum, item) => sum + item.contractValue, 0);
  }, [filteredOrders]);

  // Reset bộ lọc về mặc định
  const handleResetFilter = () => {
    setActiveStatusTab('all');
    setSearchQuery('');
    setFromDate('');
    setToDate('');
  };

  // Mở drawer xem chi tiết
  const handleOpenDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  // Cập nhật trạng thái đơn hàng từ drawer
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: Exclude<AdminOrderStatus, 'all'>,
    timelineStep: 1 | 2 | 3 | 4
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            timelineStep,
          };
        }
        return ord;
      })
    );

    // Cập nhật lại selectedOrder nếu đang mở
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              timelineStep,
            }
          : null
      );
    }
  };

  // Dữ liệu 5 ô thẻ thống kê trạng thái (Đồng bộ kiểu dáng và chiều cao với trang Khách hàng)
  const orderStatCards = [
    {
      status: 'all' as AdminOrderStatus,
      title: 'Tất cả hợp đồng',
      value: counts.all,
      unit: 'hợp đồng',
      sub: `${(totalDisplayValue / 1e9).toFixed(1)} tỷ VND`,
      subColor: 'text-[#8a6e3d] bg-amber-50/70',
      icon: FileText,
      iconColor: 'bg-zinc-200/60 text-zinc-700',
    },
    {
      status: 'completed' as AdminOrderStatus,
      title: 'Đã hoàn thành',
      value: counts.completed,
      unit: 'hợp đồng',
      sub: 'Đã giao & thanh toán đủ',
      subColor: 'text-emerald-700 bg-emerald-50',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-100/70 text-emerald-600',
    },
    {
      status: 'delivering' as AdminOrderStatus,
      title: 'Đang giao xe',
      value: counts.delivering,
      unit: 'hợp đồng',
      sub: 'Đang vận chuyển giao',
      subColor: 'text-purple-700 bg-purple-50',
      icon: Truck,
      iconColor: 'bg-purple-100/70 text-purple-600',
    },
    {
      status: 'deposited' as AdminOrderStatus,
      title: 'Đã đặt cọc',
      value: counts.deposited,
      unit: 'hợp đồng',
      sub: 'Chờ thanh toán đủ',
      subColor: 'text-amber-800 bg-amber-50',
      icon: Clock,
      iconColor: 'bg-amber-100/70 text-amber-600',
    },
    {
      status: 'cancelled' as AdminOrderStatus,
      title: 'Hợp đồng hủy',
      value: counts.cancelled,
      unit: 'hợp đồng',
      sub: 'Đã hoàn cọc / hủy',
      subColor: 'text-rose-700 bg-rose-50',
      icon: XCircle,
      iconColor: 'bg-rose-100/70 text-rose-600',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 overflow-hidden select-none font-sans">
      
      {/* ======================================================== */}
      {/* 1. KHU VỰC CỐ ĐỊNH PHÍA TRÊN (ĐỒNG NHẤT MÀU & HIỆU ỨNG)    */}
      {/* ======================================================== */}
      <div 
        className={`shrink-0 bg-white border-b border-zinc-200/80 px-8 pt-5 pb-4 space-y-4 shadow-2xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        
        {/* Top Header Thanh điều hướng phụ */}
        <div className="flex items-center justify-between gap-4">
          {/* Ô tìm kiếm nhanh top bar */}
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên khách hàng, SĐT..."
              className="w-full h-9 pl-9 pr-3.5 rounded-full bg-zinc-100/80 border border-zinc-200/60 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-[#b8955a] transition-all"
            />
          </div>

          {/* Nút Về Dashboard */}
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="h-9 px-4 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white hover:text-[#b8955a] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <LayoutDashboard className="size-3.5" />
            <span>Về Dashboard</span>
          </button>
        </div>

        {/* Tiêu đề trang & Thống kê tổng tiền */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="text-[11px] tracking-wider text-[#b8955a] uppercase font-bold">
              Hệ thống điều hành / Quản lý đơn hàng
            </p>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mt-1">
              Quản Lý Hợp Đồng & Đơn Hàng Xe
            </h1>
          </div>

          {/* Badge tổng giá trị hợp đồng */}
          <div className="bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-2xs">
            <span className="text-xs text-zinc-500 font-medium">Tổng giá trị:</span>
            <span className="text-base font-bold text-[#b8955a] tabular-nums">
              {formatCurrency(totalDisplayValue)}
            </span>
          </div>
        </div>

        {/* 5 Thẻ Thống Kê Trạng Thái (Vừa là Stat Cards vừa là bộ lọc tương tác, cùng chiều cao với khách hàng) */}
        <div className="grid grid-cols-5 gap-3.5 pt-1">
          {orderStatCards.map((card, idx) => {
            const isSelected = activeStatusTab === card.status;
            return (
              <button
                key={card.status}
                type="button"
                onClick={() => setActiveStatusTab(card.status)}
                className={`rounded-2xl p-4 flex items-center justify-between text-left transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#b8955a] shadow-sm ring-2 ring-[#b8955a]/20'
                    : 'bg-zinc-50/70 border border-zinc-200/80 hover:bg-white hover:border-zinc-300 shadow-2xs'
                } ${
                  isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-98'
                }`}
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium text-zinc-500 truncate">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-bold text-zinc-900 tabular-nums">{card.value}</span>
                    <span className="text-xs text-zinc-500">{card.unit}</span>
                  </div>
                  <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md truncate max-w-full ${card.subColor}`}>
                    {card.sub}
                  </span>
                </div>
                <div className={`size-10 shrink-0 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                  <card.icon className="size-5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Thanh công cụ Tìm kiếm chi tiết & Lọc ngày tháng */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Ô tìm kiếm đa năng */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm hợp đồng, khách hàng, số điện thoại, xe..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all shadow-2xs"
            />
          </div>

          {/* Bộ lọc khoảng ngày (Từ ngày - Đến ngày) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-600 shadow-2xs">
              <span className="text-zinc-400 text-xs whitespace-nowrap">Từ ngày:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-xs text-zinc-800 focus:outline-none font-medium bg-transparent cursor-pointer tabular-nums"
              />
            </div>

            <div className="flex items-center gap-1.5 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-600 shadow-2xs">
              <span className="text-zinc-400 text-xs whitespace-nowrap">Đến ngày:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-xs text-zinc-800 focus:outline-none font-medium bg-transparent cursor-pointer tabular-nums"
              />
            </div>

            {/* Nút Thiết lập lại */}
            <button
              type="button"
              onClick={handleResetFilter}
              className="h-10 px-3.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Khôi phục bộ lọc mặc định"
            >
              <RotateCcw className="size-3.5 text-zinc-500" />
              <span>Thiết lập lại</span>
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. KHU VỰC BẢNG DỮ LIỆU CUỘN LÊN XUỐNG VỚI HIỆU ỨNG MƯỢT  */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto pl-8 pr-[22px] py-5">
        <div 
          className={`bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
            isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-98'
          }`}
        >
          
          <div className="w-full overflow-x-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              {/* Định nghĩa tỷ lệ cố định từng cột bằng colgroup để bảng luôn đều và chuẩn 100% */}
              <colgroup>
                <col className="w-[9%]" />
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[18%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[9%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
              </colgroup>

              {/* Tiêu đề cột dính cố định khi cuộn bảng */}
              <thead className="sticky top-0 bg-zinc-50/95 backdrop-blur-xs z-10 border-b border-zinc-200/80">
                <tr className="text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="py-3.5 pl-4 pr-1.5 font-bold whitespace-nowrap">Mã Hợp Đồng</th>
                  <th className="py-3.5 px-1.5 font-bold whitespace-nowrap">Ngày Lập</th>
                  <th className="py-3.5 px-1.5 font-bold whitespace-nowrap">Khách Hàng</th>
                  <th className="py-3.5 pl-3.5 pr-1.5 font-bold">Mẫu Xe Đặt</th>
                  <th className="py-3.5 pl-3.5 pr-1.5 font-bold whitespace-nowrap">Giá Trị HĐ</th>
                  <th className="py-3.5 pl-3.5 pr-1.5 font-bold whitespace-nowrap">Đã Thanh Toán</th>
                  <th className="py-3.5 pl-3.5 pr-1.5 font-bold whitespace-nowrap">Phụ Trách</th>
                  <th className="py-3.5 px-1.5 font-bold whitespace-nowrap text-center">Trạng Thái</th>
                  <th className="py-3.5 px-1.5 font-bold whitespace-nowrap text-center">Thao Tác</th>
                </tr>
              </thead>

              {/* Danh sách các dòng dữ liệu */}
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-zinc-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="size-8 text-zinc-300" />
                        <p className="text-sm font-medium text-zinc-600">Không tìm thấy hợp đồng nào phù hợp</p>
                        <p className="text-xs text-zinc-400">Hãy thử thay đổi từ khóa tìm kiếm hoặc khoảng ngày</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, idx) => {
                    const statusConfig = ORDER_STATUS_CONFIG[order.status];

                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-zinc-50/80 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform group ${
                          isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                        }`}
                        style={{ transitionDelay: `${150 + idx * 40}ms` }}
                      >
                        {/* Mã Hợp Đồng */}
                        <td className="py-3.5 pl-4 pr-1.5 whitespace-nowrap">
                          <span className="font-semibold text-zinc-900 group-hover:text-[#b8955a] transition-colors font-mono text-[11px] tracking-tight">
                            {order.id}
                          </span>
                        </td>

                        {/* Ngày Lập */}
                        <td className="py-3.5 px-1.5 font-medium text-zinc-600 whitespace-nowrap tabular-nums text-xs">
                          {order.createdDate}
                        </td>

                        {/* Khách Hàng */}
                        <td className="py-3.5 px-1.5 min-w-0">
                          <p className="font-bold text-zinc-900 leading-snug truncate whitespace-nowrap">{order.customerName}</p>
                          <p className="text-[11px] text-zinc-400 tabular-nums mt-0.5 truncate">{order.customerPhone}</p>
                        </td>

                        {/* Mẫu Xe Đặt (Dịch nhẹ sang phải cho cân mắt) */}
                        <td className="py-3.5 pl-3.5 pr-1.5 min-w-0">
                          <p className="font-bold text-zinc-900 leading-snug truncate">{order.carModel}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{order.carColor}</p>
                        </td>

                        {/* Giá Trị HĐ (Dịch nhẹ sang phải cho cân mắt) */}
                        <td className="py-3.5 pl-3.5 pr-1.5 whitespace-nowrap">
                          <span className="font-bold text-zinc-900 tabular-nums text-xs">
                            {formatCurrency(order.contractValue)}
                          </span>
                        </td>

                        {/* Đã Thanh Toán (Dịch nhẹ sang phải cho cân mắt) */}
                        <td className="py-3.5 pl-3.5 pr-1.5 whitespace-nowrap">
                          <span
                            className={`font-bold tabular-nums text-xs ${
                              order.paidAmount < order.contractValue
                                ? 'text-red-600'
                                : 'text-zinc-900'
                            }`}
                          >
                            {formatCurrency(order.paidAmount)}
                          </span>
                        </td>

                        {/* Phụ Trách (Dịch nhẹ sang phải cho cân mắt) */}
                        <td className="py-3.5 pl-3.5 pr-1.5 font-medium text-zinc-700 whitespace-nowrap truncate text-xs">
                          {order.salesAdvisor.split('(')[0].trim()}
                        </td>

                        {/* Trạng Thái (Căn giữa) */}
                        <td className="py-3.5 px-1.5 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                statusConfig?.badgeBg || 'bg-zinc-50'
                              } ${statusConfig?.badgeText || 'text-zinc-700'}`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${statusConfig?.dotColor || 'bg-zinc-400'}`}
                              />
                              <span>{statusConfig?.label || order.status}</span>
                            </div>
                          </div>
                        </td>

                        {/* Thao Tác (Icon con mắt gióng CHÍNH GIỮA chữ Thao Tác) */}
                        <td className="py-3.5 px-1.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(order)}
                              className="size-7.5 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                              title="Xem chi tiết hợp đồng"
                            >
                              <Eye className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer thông tin số lượng bảng */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Hiển thị <strong className="text-zinc-800">{filteredOrders.length}</strong> / {orders.length} hợp đồng
            </span>
            <span className="text-xs text-zinc-400">Mercedes-Benz Dealership Management System</span>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SLIDE-OVER DRAWER XEM CHI TIẾT ĐƠN HÀNG                */}
      {/* ======================================================== */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

    </div>
  );
};

export default AdminOrdersPage;
