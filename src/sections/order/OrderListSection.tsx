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
import type { Contract } from "../../types/contract";

interface Props {
  contracts?: Contract[];
}

const formatCurrency = (value?: number | null) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("vi-VN");
};

export const OrderListSection: React.FC<Props> = ({
  contracts = [],
}) => {
  const safeContracts = Array.isArray(contracts) ? contracts : [];

  if (safeContracts.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 text-sm">
        <div className="text-4xl mb-4">📋</div>

        <p className="font-medium text-zinc-700">
          Chưa có hợp đồng nào.
        </p>

        <p className="mt-2 text-xs text-zinc-400">
          Các hợp đồng mua xe của bạn sẽ xuất hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 mb-10">
      {safeContracts.map((contract) => {
        const vehicle = contract.vehicles?.[0];

        const isCompleted =
          contract.contract_status === "completed";

        const isCancelled =
          contract.contract_status === "cancelled" ||
          contract.delivery_state === "cancelled";

        const statusLabel = isCancelled
          ? "Cancelled"
          : isCompleted
          ? "Completed"
          : contract.delivery_state === "delivered"
          ? "Delivered"
          : contract.delivery_state === "shipping"
          ? "In Transit"
          : contract.contract_status === "pending"
          ? "Pending Confirmation"
          : contract.contract_status === "active"
          ? "Processing"
          : "Processing";

        return (
          <div
            key={contract.id}
            className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-6 shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Contract Information */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="text-[11px] text-zinc-500 font-medium leading-6">
                <span className="text-zinc-800 font-bold">
                  Contract ID #{contract.id}
                </span>

                {" • "}

                Created: {formatDate(contract.created_at)}

                {" • "}

                Vehicle Value:{" "}
                <span className="font-bold text-zinc-800">
                  {formatCurrency(contract.total_amount)}
                </span>

                {" • "}

                Deposit:{" "}
                <span className="text-[#b8955a] font-bold">
                  {formatCurrency(contract.deposit)}
                </span>
              </div>

              {/* Status */}
              {isCancelled ? (
                <span className="px-3 py-1 text-[10px] font-bold text-red-600 border border-red-200 rounded-full bg-red-50">
                  {statusLabel}
                </span>
              ) : isCompleted ||
                contract.delivery_state === "delivered" ? (
                <span className="px-3 py-1 text-[10px] font-bold text-zinc-600 border border-zinc-200 rounded-full bg-zinc-50">
                  ✓ {statusLabel}
                </span>
              ) : contract.delivery_state === "shipping" ? (
                <span className="px-3 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200 rounded-full bg-emerald-50 flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  {statusLabel}
                </span>
              ) : (
                <span className="px-3 py-1 text-[10px] font-bold text-[#b8955a] border border-[#b8955a]/30 rounded-full bg-[#b8955a]/5">
                  {statusLabel}
                </span>
              )}
            </div>

            {/* Vehicle Information */}
            <div className="flex gap-5 items-center">
              <div className="w-40 aspect-[16/10] shrink-0 rounded-lg overflow-hidden bg-zinc-100">
                <img
                  src={
                    vehicle?.image_url ||
                    "/images/car-placeholder.png"
                  }
                  alt={vehicle?.model || "Vehicle"}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "/images/car-placeholder.png";
                  }}
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <h3 className="text-lg font-serif font-bold text-zinc-950">
                  {vehicle
                    ? `${vehicle.brand || ""} ${vehicle.model || ""}`
                    : "Vehicle information unavailable"}
                </h3>

                <p className="text-[11px] text-zinc-500">
                  {vehicle?.vin && (
                    <>
                      <span className="font-bold text-zinc-800">
                        VIN:
                      </span>{" "}
                      {vehicle.vin}
                      {" • "}
                    </>
                  )}

                  <span className="font-bold text-zinc-800">
                    Year:
                  </span>{" "}
                  {vehicle?.year || "N/A"}

                  {" • "}

                  <span className="font-bold text-zinc-800">
                    Variant:
                  </span>{" "}
                  {vehicle?.variant || "N/A"}

                  {" • "}

                  <span className="font-bold text-zinc-800">
                    Qty:
                  </span>{" "}
                  {contract.vehicles?.length || 0}
                </p>

                <p className="text-[11px] text-zinc-500">
                  <span className="font-bold text-zinc-800">
                    Purchase type:
                  </span>{" "}
                  {contract.purchase_type === "cash"
                    ? "Cash"
                    : "Installment"}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-zinc-100" />

            {/* Delivery Information */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-[11px] text-zinc-500 font-medium space-y-1">
                <p>
                  Delivery address:{" "}
                  {contract.shipping_address || "N/A"}
                </p>

                <p>
                  Delivery status:{" "}
                  {contract.delivery_state || "N/A"}
                </p>

                {contract.delivery_date && (
                  <p>
                    Expected delivery:{" "}
                    {formatDate(contract.delivery_date)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `/contracts/${contract.id}`;
                }}
                className="px-5 py-2 text-[10px] font-bold tracking-widest text-white bg-[#af8d55] hover:bg-[#9d7d49] rounded-lg uppercase transition"
              >
                View Contract
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};