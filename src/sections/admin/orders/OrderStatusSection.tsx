
import React from "react";
import type { AdminOrderStatus } from "../../../types/adminOrder.types";

type OrderStatus = Exclude<AdminOrderStatus, "all">;

interface Props {
  selectedStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  onSave: () => void;
}

const OrderStatusSection: React.FC<Props> = ({
  selectedStatus,
  onStatusChange,
  onSave,
}) => {
  return (
    <div className="bg-[#fbfaf8] border border-[#e8dfcf] rounded-2xl p-5 shadow-xs">
      <label className="text-xs uppercase tracking-wider text-zinc-600 font-bold block mb-2.5">
        Cập nhật tiến độ thanh toán & trạng thái
      </label>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <select
            value={selectedStatus}
            onChange={(e) =>
              onStatusChange(e.target.value as OrderStatus)
            }
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
          onClick={onSave}
          className="h-10 px-5 bg-zinc-950 hover:bg-zinc-900 active:scale-95 text-white hover:text-[#b8955a] border border-zinc-800 hover:border-[#b8955a] rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
};

export default OrderStatusSection;
