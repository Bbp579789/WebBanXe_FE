
import React from "react";
import { User } from "lucide-react";
import type { AdminOrder } from "../../../types/adminOrder.types";

interface OrderCustomerInfoProps {
  order: AdminOrder;
}

const OrderCustomerInfo: React.FC<OrderCustomerInfoProps> = ({
  order,
}) => {
  const customerFields = [
    {
      label: "Chủ hợp đồng",
      value: order.customerName,
      className: "font-bold text-zinc-900 text-[13px]",
    },
    {
      label: "Số điện thoại",
      value: order.customerPhone,
      className: "font-semibold text-zinc-800 tabular-nums",
    },
  ];

  return (
    <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
        <User className="size-4 text-[#b8955a]" />

        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
          Thông Tin Khách Hàng & Giao Nhận
        </h3>
      </div>

      {/* Customer information */}
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
        {customerFields.map((field) => (
          <div key={field.label}>
            <span className="text-zinc-400 text-xs block mb-0.5">
              {field.label}:
            </span>

            <span className={field.className}>
              {field.value || "Chưa cập nhật"}
            </span>
          </div>
        ))}

        {/* CCCD */}
        <div className="col-span-2">
          <span className="text-zinc-400 text-xs block mb-0.5">
            CCCD / Mã số thuế:
          </span>

          <span className="text-zinc-800 font-medium">
            {order.customerIdCard || "Chưa cập nhật"}
          </span>
        </div>

        {/* Email */}
        <div className="col-span-2">
          <span className="text-zinc-400 text-xs block mb-0.5">
            Email liên hệ:
          </span>

          <span className="text-zinc-700 font-medium">
            {order.customerEmail || "Chưa cập nhật"}
          </span>
        </div>

        {/* Delivery address */}
        <div className="col-span-2">
          <span className="text-zinc-400 text-xs block mb-0.5">
            Địa chỉ bàn giao xe:
          </span>

          <span className="text-zinc-800 font-medium leading-relaxed">
            {order.deliveryAddress || "Chưa cập nhật"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
