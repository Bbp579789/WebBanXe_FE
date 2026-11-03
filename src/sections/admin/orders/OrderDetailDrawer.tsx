import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Car,
  User,
  ShieldCheck,
  Check,
} from 'lucide-react';
import type { AdminOrder, AdminOrderStatus } from '../../../types/adminOrder.types';
import { ORDER_STATUS_CONFIG } from '../../../data/adminOrdersData';

interface OrderDetailDrawerProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: Exclude<AdminOrderStatus, 'all'>, timelineStep: 1 | 2 | 3 | 4) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Exclude<AdminOrderStatus, 'all'>>('deposited');
  const [selectedTimelineStep, setSelectedTimelineStep] = useState<1 | 2 | 3 | 4>(2);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setSelectedTimelineStep(order.timelineStep);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleStatusChange = (status: Exclude<AdminOrderStatus, 'all'>) => {
    setSelectedStatus(status);
    // Tự động map timeline step tương ứng
    if (status === 'cancelled') {
      setSelectedTimelineStep(1);
    } else if (status === 'deposited') {
      setSelectedTimelineStep(2);
    } else if (status === 'delivering') {
      setSelectedTimelineStep(3);
    } else if (status === 'completed') {
      setSelectedTimelineStep(4);
    }
  };

  const handleSaveStatus = () => {
    onUpdateStatus(order.id, selectedStatus, selectedTimelineStep);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const timelineSteps = [
    { step: 1, label: 'Đặt cọc' },
    { step: 2, label: 'Ký HĐ & Đóng tiền' },
    { step: 3, label: 'Đang giao' },
    { step: 4, label: 'Bàn giao chìa khóa' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <aside className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-zinc-200 animate-in slide-in-from-right duration-300">
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] tracking-wider text-[#b8955a] uppercase font-bold">
                CHI TIẾT HỢP ĐỒNG ĐẶT XE
              </span>
              <span className="size-1 rounded-full bg-zinc-300" />
              <span className="text-xs text-zinc-500 font-medium tabular-nums">Ngày lập: {order.createdDate}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{order.id}</h2>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  ORDER_STATUS_CONFIG[order.status]?.badgeBg || 'bg-zinc-50'
                } ${ORDER_STATUS_CONFIG[order.status]?.badgeText || 'text-zinc-700'}`}
              >
                <span className={`size-1.5 rounded-full ${ORDER_STATUS_CONFIG[order.status]?.dotColor || 'bg-zinc-400'}`} />
                {ORDER_STATUS_CONFIG[order.status]?.label || order.status}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="size-9 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 flex items-center justify-center transition-all cursor-pointer"
              title="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Thông báo cập nhật trạng thái */}
        {showToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200 shadow-inner">
            <Check className="size-4 shrink-0" />
            <span>Đã cập nhật trạng thái đơn hàng và tiến độ thành công!</span>
          </div>
        )}

        {/* Nội dung chi tiết có thể cuộn */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Box cập nhật trạng thái & tiến trình */}
          <div className="bg-[#fbfaf8] border border-[#e8dfcf] rounded-2xl p-5 shadow-xs">
            <label className="text-xs uppercase tracking-wider text-zinc-600 font-bold block mb-2.5">
              Cập nhật tiến độ thanh toán & trạng thái
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value as Exclude<AdminOrderStatus, 'all'>)}
                  className="w-full h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#b8955a]/30 focus:border-[#b8955a] transition-all cursor-pointer shadow-2xs"
                >
                  <option value="deposited">Đã cọc</option>
                  <option value="delivering">Đang giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSaveStatus}
                className="h-10 px-5 bg-zinc-950 hover:bg-zinc-900 active:scale-95 text-white hover:text-[#b8955a] border border-zinc-800 hover:border-[#b8955a] rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>Cập nhật</span>
              </button>
            </div>
          </div>

          {/* Stepper Tiến trình Bàn Giao Xe */}
          <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Tiến Trình Bàn Giao Xe
              </h3>
              <span className="text-xs text-[#b8955a] font-bold">
                Bước {selectedTimelineStep}/4
              </span>
            </div>

            <div className="relative flex items-center justify-between">
              {/* Thanh line nối */}
              <div className="absolute left-6 right-6 top-4 h-[2px] bg-zinc-200 -z-0" />
              <div
                className="absolute left-6 top-4 h-[2px] bg-[#b8955a] -z-0 transition-all duration-500"
                style={{ width: `${((selectedTimelineStep - 1) / 3) * 85}%` }}
              />

              {timelineSteps.map((item) => {
                const isPassed = item.step <= selectedTimelineStep;
                const isCurrent = item.step === selectedTimelineStep;

                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setSelectedTimelineStep(item.step as 1 | 2 | 3 | 4)}
                    className="flex flex-col items-center group relative z-10 focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isCurrent
                          ? 'bg-zinc-950 text-[#b8955a] ring-4 ring-[#b8955a]/20 shadow-md'
                          : isPassed
                          ? 'bg-[#b8955a] text-white shadow-sm'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                      }`}
                    >
                      {isPassed && !isCurrent ? <Check className="size-4" /> : item.step}
                    </div>
                    <span
                      className={`mt-2 text-[11px] font-medium text-center transition-colors max-w-[90px] leading-tight ${
                        isCurrent ? 'text-zinc-900 font-bold' : isPassed ? 'text-zinc-700' : 'text-zinc-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Khối 1: Thông Tin Khách Hàng & Giao Nhận */}
          <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <User className="size-4 text-[#b8955a]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Thông Tin Khách Hàng & Giao Nhận
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
              <div>
                <span className="text-zinc-400 text-xs block mb-0.5">Chủ hợp đồng:</span>
                <span className="font-bold text-zinc-900 text-[13px]">{order.customerName}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-xs block mb-0.5">Số điện thoại:</span>
                <span className="font-semibold text-zinc-800 tabular-nums">{order.customerPhone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-400 text-xs block mb-0.5">CCCD / Mã số thuế:</span>
                <span className="text-zinc-800 font-medium">{order.customerIdCard}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-400 text-xs block mb-0.5">Email liên hệ:</span>
                <span className="text-zinc-700 font-medium">{order.customerEmail}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-400 text-xs block mb-0.5">Địa chỉ bàn giao xe:</span>
                <span className="text-zinc-800 font-medium leading-relaxed">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>

          {/* Khối 2: Thông Số Xe Bàn Giao */}
          <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Car className="size-4 text-[#b8955a]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Thông Số Xe Bàn Giao
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
              <div className="col-span-2">
                <span className="text-zinc-400 text-xs block mb-0.5">Phiên bản xe:</span>
                <span className="font-bold text-zinc-900 text-sm">{order.carModel}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-400 text-xs block mb-0.5">Màu sắc ngoại/nội thất:</span>
                <span className="text-zinc-700 font-medium">{order.carColor}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-xs block mb-0.5">Số khung (VIN):</span>
                <span className="font-semibold text-zinc-800 tabular-nums tracking-wide">{order.vin}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-xs block mb-0.5">Số máy (Engine):</span>
                <span className="font-semibold text-zinc-800 tabular-nums tracking-wide">{order.engineNo}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-xs block mb-0.5">Năm sản xuất & Nguồn gốc:</span>
                <span className="text-zinc-800 font-medium">{order.manufactureYear}</span>
              </div>
              <div>
                <span className="text-zinc-400 text-xs block mb-0.5">Tư vấn bán hàng phụ trách:</span>
                <span className="font-semibold text-[#b8955a]">{order.salesAdvisor}</span>
              </div>
            </div>
          </div>

          {/* Khối 3: Tổng Kết Tài Chính Hợp Đồng */}
          <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <ShieldCheck className="size-4 text-[#b8955a]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Tổng Kết Tài Chính Hợp Đồng
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Giá xe niêm yết:</span>
                <span className="font-semibold text-zinc-800 tabular-nums">{formatCurrency(order.contractValue)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Phí trước bạ & ra biển (tạm tính):</span>
                <span className="font-semibold text-zinc-800 tabular-nums">{formatCurrency(order.registrationFee)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Bảo hiểm thân vỏ & phụ kiện cao cấp:</span>
                <span className="font-semibold text-zinc-800 tabular-nums">{formatCurrency(order.insuranceFee)}</span>
              </div>
              {order.discount !== 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Ưu đãi giảm giá độc quyền:</span>
                  <span className="font-bold tabular-nums">{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                <span className="font-bold text-zinc-900 uppercase text-xs tracking-wider">
                  TỔNG GIÁ TRỊ THANH TOÁN:
                </span>
                <span className="font-bold text-lg text-[#b8955a] tabular-nums">
                  {formatCurrency(order.totalValue)}
                </span>
              </div>
            </div>

            {/* 2 Khung tóm tắt Đã thanh toán & Còn phải thu */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-3.5">
                <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-bold block mb-1">
                  Đã thanh toán
                </span>
                <span className="text-sm font-bold text-emerald-700 tabular-nums">
                  {formatCurrency(order.paidAmount)}
                </span>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3.5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">
                  Còn phải thu
                </span>
                <span className="text-sm font-bold text-zinc-900 tabular-nums">
                  {formatCurrency(order.remainingAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="p-4 border-t border-zinc-200/80 bg-zinc-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-900 active:scale-95 border border-zinc-800 hover:border-[#b8955a] text-white hover:text-[#b8955a] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="size-4" />
            <span>In hợp đồng (PDF)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-10 px-6 rounded-xl border border-zinc-300 hover:bg-zinc-200/60 active:scale-95 text-zinc-700 text-xs font-semibold transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </aside>
    </div>
  );
};
