
import React from "react";
import {
  X,
  Printer,
  Check,
} from "lucide-react";

import type {
  AdminOrder,
  AdminOrderStatus,
} from "../../../types/adminOrder.types";

import { useOrderDetail } from "../../../hooks/admin/useAdminOrderDetailDrawer";
import { formatDate } from "../../../utils/admin/order.utils";

import OrderStatusSection from "./OrderStatusSection";
import OrderTimeline from "./OrderTimeline";
import OrderCustomerInfo from "./OrderCustomerInfo";
import OrderVehicleInfo from "./OrderVehicleInfo";
import OrderFinancialSummary from "./OrderFinancialSummary";

type OrderStatus = Exclude<AdminOrderStatus, "all">;

interface OrderDetailDrawerProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    orderId: string,
    newStatus: OrderStatus,
    timelineStep: 1 | 2 | 3 | 4
  ) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const {
    selectedStatus,
    selectedTimelineStep,
    showToast,
    handleStatusChange,
    handleTimelineChange,
    handleSaveStatus,
  } = useOrderDetail({
    order,
    onUpdateStatus,
  });

  if (!isOpen || !order) return null;


  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-zinc-200 animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] tracking-wider text-[#b8955a] uppercase font-bold">
                CHI TIẾT HỢP ĐỒNG ĐẶT XE
              </span>

              <span className="size-1 rounded-full bg-zinc-300" />

              <span className="text-xs text-zinc-500 font-medium tabular-nums">
                Ngày lập: {formatDate(order.createdDate)}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                {order.id}
              </h2>

            
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 flex items-center justify-center transition-all cursor-pointer"
            title="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Toast */}
        {showToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200 shadow-inner">
            <Check className="size-4 shrink-0" />
            <span>
              Đã gửi yêu cầu cập nhật trạng thái đơn hàng!
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <OrderStatusSection
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            onSave={handleSaveStatus}
          />

          <OrderTimeline
            selectedStep={selectedTimelineStep}
            onStepChange={handleTimelineChange}
          />

          <OrderCustomerInfo order={order} />

          <OrderVehicleInfo order={order} />

          <OrderFinancialSummary order={order} />
        </div>

        {/* Footer */}
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

export default OrderDetailDrawer;
