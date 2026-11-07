
import React from "react";
import { Car } from "lucide-react";
import type { AdminOrder } from "../../../types/adminOrder.types";

interface Props {
  order: AdminOrder;
}

const OrderVehicleInfo: React.FC<Props> = ({ order }) => {
  return (
    <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
        <Car className="size-4 text-[#b8955a]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
          Thông Số Xe Bàn Giao
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
        <div className="col-span-2">
          <span className="text-zinc-400 block mb-0.5">
            Phiên bản xe:
          </span>
          <span className="font-bold text-zinc-900 text-sm">
            {order.carModel}
          </span>
        </div>

        <div className="col-span-2">
          <span className="text-zinc-400 block mb-0.5">
            Màu sắc ngoại/nội thất:
          </span>
          <span className="text-zinc-700 font-medium">
            {order.carColor}
          </span>
        </div>

        <div>
          <span className="text-zinc-400 block mb-0.5">
            Số khung (VIN):
          </span>
          <span className="font-semibold text-zinc-800 tabular-nums tracking-wide">
            {order.vin || "Chưa cập nhật"}
          </span>
        </div>

        <div>
          <span className="text-zinc-400 block mb-0.5">
            Số máy (Engine):
          </span>
          <span className="font-semibold text-zinc-800 tabular-nums tracking-wide">
            {order.engineNo || "Chưa cập nhật"}
          </span>
        </div>

        <div>
          <span className="text-zinc-400 block mb-0.5">
            Năm sản xuất & Nguồn gốc:
          </span>
          <span className="text-zinc-800 font-medium">
            {order.manufactureYear}
          </span>
        </div>

        <div>
          <span className="text-zinc-400 block mb-0.5">
            Tư vấn bán hàng phụ trách:
          </span>
          <span className="font-semibold text-[#b8955a]">
            {order.salesAdvisor}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderVehicleInfo;
