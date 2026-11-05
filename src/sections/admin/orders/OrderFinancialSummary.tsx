
import React from "react";
import { ShieldCheck } from "lucide-react";
import type { AdminOrder } from "../../../types/adminOrder.types";
import { formatCurrency } from "../../../utils/admin/order.utils";

interface Props {
  order: AdminOrder;
}

const OrderFinancialSummary: React.FC<Props> = ({ order }) => {
  return (
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
          <span className="font-semibold text-zinc-800 tabular-nums">
            {formatCurrency(order.contractValue)}
          </span>
        </div>

        <div className="flex justify-between text-zinc-600">
          <span>Phí trước bạ & ra biển (tạm tính):</span>
          <span className="font-semibold text-zinc-800 tabular-nums">
            {formatCurrency(order.registrationFee)}
          </span>
        </div>

        <div className="flex justify-between text-zinc-600">
          <span>Bảo hiểm thân vỏ & phụ kiện cao cấp:</span>
          <span className="font-semibold text-zinc-800 tabular-nums">
            {formatCurrency(order.insuranceFee)}
          </span>
        </div>

        {order.discount !== 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Ưu đãi giảm giá độc quyền:</span>
            <span className="font-bold tabular-nums">
              {formatCurrency(order.discount)}
            </span>
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
  );
};

export default OrderFinancialSummary;
