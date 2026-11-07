// import React from "react";
// import type { Contract } from "../../types/contract";

// interface Props {
//   contracts: Contract[];
// }

// const formatCurrency = (value: number) => {
//   return new Intl.NumberFormat("vi-VN", {
//     style: "currency",
//     currency: "VND",
//     maximumFractionDigits: 0,
//   }).format(value || 0);
// };

// const formatDate = (date: string) => {
//   return new Date(date).toLocaleDateString("vi-VN");
// };

// export const OrderListSection: React.FC<Props> = ({ contracts }) => {
//   if (contracts.length === 0) {
//     return (
//       <div className="py-20 text-center text-zinc-500 text-sm">
//         Chưa có hợp đồng nào.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-5 mb-10">
//       {contracts.map((contract) => {
//         const vehicle = contract.vehicles?.[0];

//         const isCompleted =
//           contract.contract_status === "completed";

//         const isCancelled =
//           contract.contract_status === "cancelled" ||
//           contract.delivery_state === "cancelled";

//         const statusLabel = isCancelled
//           ? "Cancelled"
//           : isCompleted
//           ? "Completed"
//           : contract.delivery_state === "delivered"
//           ? "Delivered"
//           : contract.delivery_state === "shipping"
//           ? "In Transit"
//           : contract.contract_status === "pending"
//           ? "Pending Confirmation"
//           : contract.contract_status === "active"
//           ? "Processing"
//           : "Processing";

//         return (
//           <div
//             key={contract.id}
//             className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-6 shadow-xs hover:shadow-md transition-shadow"
//           >
//             {/* Top Row: Contract Info & Status */}
//             <div className="flex flex-wrap justify-between items-start gap-4">
//               <div className="text-[11px] text-zinc-500 font-medium">
//                 <span className="text-zinc-800">
//                   Contract ID #{contract.id}
//                 </span>

//                 {" • "}
//                 Created: {formatDate(contract.created_at)}

//                 {" • "}
//                 Vehicle Value:{" "}
//                 <span className="font-bold text-zinc-800">
//                   {formatCurrency(contract.total_amount)}
//                 </span>

//                 {" • "}
//                 Deposit:{" "}
//                 <span className="text-[#b8955a] font-bold">
//                   {formatCurrency(contract.deposit)}
//                 </span>
//               </div>

//               {/* Status Badge */}
//               {isCancelled ? (
//                 <span className="px-3 py-1 text-[10px] font-bold text-red-600 border border-red-200 rounded-full bg-red-50">
//                   {statusLabel}
//                 </span>
//               ) : isCompleted ||
//                 contract.delivery_state === "delivered" ? (
//                 <span className="px-3 py-1 text-[10px] font-bold text-zinc-600 border border-zinc-200 rounded-full bg-zinc-50">
//                   ✓ {statusLabel}
//                 </span>
//               ) : contract.delivery_state === "shipping" ? (
//                 <span className="px-3 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200 rounded-full bg-emerald-50 flex items-center gap-1.5">
//                   <div className="size-1.5 rounded-full bg-emerald-500" />
//                   {statusLabel}
//                 </span>
//               ) : (
//                 <span className="px-3 py-1 text-[10px] font-bold text-[#b8955a] border border-[#b8955a]/30 rounded-full bg-[#b8955a]/5">
//                   {statusLabel}
//                 </span>
//               )}
//             </div>

//             {/* Middle Row: Vehicle Details */}
//             <div className="flex gap-5 items-center">
//               <div className="w-40 aspect-[16/10] shrink-0 rounded-lg overflow-hidden bg-zinc-100">
//                 <img
//                   src={vehicle?.image_url || "/images/car-placeholder.png"}
//                   alt={vehicle?.model || "Vehicle"}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <h3 className="text-lg font-serif font-bold text-zinc-950">
//                   {vehicle
//                     ? `${vehicle.brand || ""} ${vehicle.model || ""}`
//                     : "Vehicle information unavailable"}
//                 </h3>

//                 <p className="text-[11px] text-zinc-500">
//                   {vehicle?.vin && (
//                     <>
//                       <span className="font-bold text-zinc-800">
//                         VIN:
//                       </span>{" "}
//                       {vehicle.vin}
//                       {" • "}
//                     </>
//                   )}

//                   <span className="font-bold text-zinc-800">
//                     Year:
//                   </span>{" "}
//                   {vehicle?.year || "N/A"}

//                   {" • "}

//                   <span className="font-bold text-zinc-800">
//                     Variant:
//                   </span>{" "}
//                   {vehicle?.variant || "N/A"}

//                   {" • "}

//                   <span className="font-bold text-zinc-800">
//                     Qty:
//                   </span>{" "}
//                   {contract.vehicles?.length || 0}
//                 </p>

//                 <p className="text-[11px] text-zinc-500">
//                   <span className="font-bold text-zinc-800">
//                     Purchase type:
//                   </span>{" "}
//                   {contract.purchase_type === "cash"
//                     ? "Cash"
//                     : "Installment"}
//                 </p>
//               </div>
//             </div>

//             <div className="w-full h-px bg-zinc-100" />

//             {/* Bottom Row: Delivery Information */}
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="text-[11px] text-zinc-500 font-medium space-y-1">
//                 <p>
//                   Delivery address: {contract.shipping_address}
//                 </p>

//                 <p>
//                   Delivery status: {contract.delivery_state}
//                 </p>

//                 {contract.delivery_date && (
//                   <p>
//                     Expected delivery:{" "}
//                     {formatDate(contract.delivery_date)}
//                   </p>
//                 )}
//               </div>

//               <button
//                 onClick={() => {
//                   window.location.href = `/contracts/${contract.id}`;
//                 }}
//                 className="px-5 py-2 text-[10px] font-bold tracking-widest text-white bg-[#af8d55] hover:bg-[#9d7d49] rounded-lg uppercase transition"
//               >
//                 View Contract
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };



import React from "react";
import {
  CalendarDays,
  MapPin,
  Car,
  Package,
} from "lucide-react";

import type {
  Contract,
  ContractDetail,
} from "../../types/contract";

interface Props {
  contracts?: Contract[];
}

const formatCurrency = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") {
    return "Đang cập nhật";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Đang cập nhật";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (date?: string | null) => {
  if (!date) return "Đang cập nhật";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Đang cập nhật";
  }

  return parsedDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getContractStatus = (status: Contract["contract_status"]) => {
  switch (status) {
    case "pending":
      return {
        label: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-700",
      };

    case "active":
      return {
        label: "Đang xử lý",
        className: "bg-blue-100 text-blue-700",
      };

    case "completed":
      return {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700",
      };

    case "cancelled":
      return {
        label: "Đã hủy",
        className: "bg-red-100 text-red-700",
      };

    default:
      return {
        label: "Không xác định",
        className: "bg-gray-100 text-gray-700",
      };
  }
};

const getDeliveryStatus = (status: Contract["delivery_state"]) => {
  switch (status) {
    case "in_progress":
      return "Đang xử lý";

    case "shipping":
      return "Đang giao xe";

    case "delivered":
      return "Đã bàn giao";

    case "cancelled":
      return "Đã hủy giao hàng";

    default:
      return "Đang cập nhật";
  }
};

interface VehicleItemProps {
  vehicle: ContractDetail;
}

const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle }) => {
  const vehicleName = [vehicle.brand, vehicle.model]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col sm:flex-row gap-4 border border-gray-100 rounded-xl p-4">
      {vehicle.image_url && (
        <div className="w-full sm:w-36 h-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={vehicle.image_url}
            alt={vehicleName || "Xe"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-base">
          {vehicleName || "Thông tin xe"}
        </h4>

        {vehicle.year && (
          <p className="text-sm text-gray-500 mt-1">
            Năm sản xuất: {vehicle.year}
          </p>
        )}

        {vehicle.vin && (
          <p className="text-sm text-gray-500 mt-1">
            VIN: {vehicle.vin}
          </p>
        )}

        {vehicle.variant && (
          <p className="text-sm text-gray-500 mt-1">
            Phiên bản: {vehicle.variant}
          </p>
        )}

        <p className="text-sm font-semibold text-gray-900 mt-2">
          {formatCurrency(vehicle.unit_price ?? vehicle.price)}
        </p>
      </div>
    </div>
  );
};

const OrderListSection: React.FC<Props> = ({
  contracts = [],
}) => {

  if (!contracts.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <Package
          size={48}
          className="mx-auto text-gray-300 mb-4"
        />

        <h3 className="text-lg font-semibold text-gray-800">
          Chưa có đơn hàng
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          Các hợp đồng mua xe của bạn sẽ hiển thị tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {contracts.map((contract) => {
        const status = getContractStatus(
          contract.contract_status
        );

        const vehicles = Array.isArray(contract.contractDetails)
          ? contract.contractDetails
          : [];

        return (
          <div
            key={contract.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500">
                  Mã hợp đồng
                </p>

                <h3 className="font-bold text-gray-900 text-lg">
                  #{contract.id}
                </h3>

                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <CalendarDays size={15} />
                  {formatDate(contract.created_at)}
                </p>
              </div>

              <span
                className={`inline-flex items-center w-fit px-3 py-1.5 rounded-full text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>

            {/* Vehicle list */}
            <div className="p-5 space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Car size={18} />
                Thông tin xe ({vehicles.length})
              </h4>

              {vehicles.length > 0 ? (
                <div className="space-y-3">
                  {vehicles.map((vehicle, index) => (
                    <VehicleItem
                      key={`${vehicle.id}-${index}`}
                      vehicle={vehicle}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Backend chưa trả về thông tin chi tiết xe.
                </p>
              )}
            </div>

            {/* Contract information */}
            <div className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Tổng giá trị hợp đồng
                  </p>

                  <p className="font-semibold text-gray-900">
                    {formatCurrency(contract.total_amount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Tiền đặt cọc
                  </p>

                  <p className="font-semibold text-blue-700">
                    {formatCurrency(contract.deposit)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Hình thức mua
                  </p>

                  <p className="font-medium text-gray-800">
                    {contract.purchase_type === "cash"
                      ? "Thanh toán tiền mặt"
                      : "Trả góp / Giao dịch"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Trạng thái giao xe
                  </p>

                  <p className="font-medium text-gray-800">
                    {getDeliveryStatus(contract.delivery_state)}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin size={14} />
                    Địa điểm nhận xe
                  </p>

                  <p className="font-medium text-gray-800">
                    {contract.shipping_address || "Đang cập nhật"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-5 py-4 border-t border-gray-100">
              {/* <button
                type="button"
                onClick={() =>
                  navigate(`/contracts/${contract.id}`)
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <Eye size={16} />
                Xem chi tiết
              </button> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderListSection;