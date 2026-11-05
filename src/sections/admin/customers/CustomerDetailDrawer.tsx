// import React from 'react';
// import { User, Car, Edit3 } from 'lucide-react';
// import type { AdminCustomer } from '../../../types/adminCustomer.types';
// import { MEMBERSHIP_CONFIG } from '../../../data/adminCustomersData';

// interface CustomerDetailDrawerProps {
//   customer: AdminCustomer | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onOpenEdit: (customer: AdminCustomer) => void;
// }

// export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
//   customer,
//   isOpen,
//   onClose,
//   onOpenEdit,
// }) => {
//   if (!isOpen || !customer) return null;

//   const memberConfig = MEMBERSHIP_CONFIG[customer.membership];
//   const isActive = customer.status === 'active';

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans select-none">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
//         onClick={onClose}
//       />

//       {/* Slide-over Panel */}
//       <aside className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-zinc-200 animate-in slide-in-from-right duration-300">
        
//         {/* Header Drawer (Đã xóa dấu X theo yêu cầu) */}
//         <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
//           <div>
//             <div className="flex items-center gap-2">
//               <span className="text-[11px] font-bold tracking-widest text-[#b8955a] uppercase">
//                 HỒ SƠ KHÁCH HÀNG CRM
//               </span>
//               <span className="size-1 rounded-full bg-zinc-300" />
//               <span className="text-xs text-zinc-500 tabular-nums">Ngày gia nhập: {customer.joinDate}</span>
//             </div>
//             <div className="flex items-center gap-3 mt-1.5">
//               <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{customer.fullName}</h2>
//               <div
//                 className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
//                   isActive
//                     ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
//                     : 'bg-zinc-100 text-zinc-600 border-zinc-200'
//                 }`}
//               >
//                 <span className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
//                 <span>{isActive ? 'Đang hoạt động' : 'Đang khóa'}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Nội dung chi tiết cuộn */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
//           {/* Card Hạng Thành Viên */}
//           <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-950 text-white flex items-center justify-between shadow-sm border border-zinc-800">
//             <div>
//               <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 block mb-1">
//                 Hạng Thẻ Thành Viên
//               </span>
//               <h3 className="text-base font-bold text-[#d4af37]">
//                 {memberConfig.label}
//               </h3>
//               <p className="text-xs text-zinc-400 mt-1">Mã khách hàng: {customer.id}</p>
//             </div>
//             <div className="size-12 rounded-2xl bg-zinc-800/80 border border-[#b8955a]/40 text-[#b8955a] flex items-center justify-center font-bold text-base shadow-inner">
//               {customer.avatarText || customer.fullName.substring(0, 2).toUpperCase()}
//             </div>
//           </div>

//           {/* Khối 1: Thông Tin Định Danh */}
//           <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs space-y-3.5">
//             <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
//               <User className="size-4 text-[#b8955a]" />
//               <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
//                 Thông Tin Cá Nhân & Liên Hệ
//               </h3>
//             </div>

//             <div className="grid grid-cols-2 gap-y-3 text-xs">
//               <div>
//                 <span className="text-zinc-400 text-xs block mb-0.5">Số điện thoại:</span>
//                 <span className="font-semibold text-zinc-800 tabular-nums">{customer.phone}</span>
//               </div>
//               <div>
//                 <span className="text-zinc-400 text-xs block mb-0.5">Số CCCD / MST:</span>
//                 <span className="font-medium text-zinc-800 tabular-nums">{customer.idCard}</span>
//               </div>
//               <div className="col-span-2">
//                 <span className="text-zinc-400 text-xs block mb-0.5">Email định danh:</span>
//                 <span className="font-medium text-zinc-700">{customer.email}</span>
//               </div>
//               <div className="col-span-2">
//                 <span className="text-zinc-400 text-xs block mb-0.5">Địa chỉ liên kết:</span>
//                 <span className="font-medium text-zinc-800">{customer.address}</span>
//               </div>
//             </div>
//           </div>

//           {/* Khối 2: Mẫu Xe Quan Tâm / Đã Mua */}
//           <div className="border border-zinc-100 rounded-2xl p-5 bg-white shadow-2xs space-y-3.5">
//             <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
//               <Car className="size-4 text-[#b8955a]" />
//               <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
//                 Mẫu Xe Quan Tâm / Đã Mua
//               </h3>
//             </div>

//             <div className="space-y-2 text-xs">
//               <div>
//                 <span className="text-zinc-400 text-xs block mb-0.5">Phiên bản xe:</span>
//                 <span className="font-bold text-zinc-900 text-sm">{customer.interestedCar}</span>
//               </div>
//               {customer.notes && (
//                 <div className="pt-2">
//                   <span className="text-zinc-400 text-xs block mb-0.5">Ghi chú CSKH & Sở thích:</span>
//                   <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200/60 leading-relaxed">
//                     {customer.notes}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>

//         {/* Footer Drawer Actions: Giữ nguyên nút Chỉnh sửa hồ sơ và nút Đóng cân đối */}
//         <div className="p-4 border-t border-zinc-200/80 bg-zinc-50 flex items-center justify-between gap-3">
//           <button
//             type="button"
//             onClick={() => onOpenEdit(customer)}
//             className="flex-1 h-10 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-[#b8955a] text-white hover:text-[#b8955a] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
//           >
//             <Edit3 className="size-4 text-[#b8955a]" />
//             <span>Chỉnh sửa hồ sơ</span>
//           </button>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 h-10 px-6 rounded-xl border border-zinc-300 hover:bg-zinc-200/60 active:scale-95 text-zinc-700 text-xs font-semibold transition-all cursor-pointer text-center"
//           >
//             Đóng
//           </button>
//         </div>

//       </aside>
//     </div>
//   );
// };


import React from "react";
import { User, Car, Edit3 } from "lucide-react";

import type { AdminCustomer } from "../../../types/adminCustomer.types";

interface Props {
  customer: AdminCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEdit: (customer: AdminCustomer) => void;
}

export const CustomerDetailDrawer: React.FC<Props> = ({
  customer,
  isOpen,
  onClose,
  onOpenEdit,
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-zinc-200 bg-white shadow-2xl">
        <div className="border-b border-zinc-100 bg-zinc-50 p-6">
          <span className="text-[11px] font-bold tracking-widest text-[#b8955a]">
            HỒ SƠ KHÁCH HÀNG CRM
          </span>

          <h2 className="mt-2 text-xl font-bold text-zinc-900">
            {customer.fullName}
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Ngày gia nhập: {customer.joinDate}
          </p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-white">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                Mã khách hàng
              </span>

              <p className="mt-1 font-bold text-[#d4af37]">
                {customer.id}
              </p>
            </div>

            <div className="flex size-12 items-center justify-center rounded-2xl border border-[#b8955a]/40 bg-zinc-800 font-bold text-[#b8955a]">
              {customer.avatarText}
            </div>
          </div>

          <section className="space-y-4 rounded-2xl border border-zinc-100 p-5">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <User className="size-4 text-[#b8955a]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Thông tin cá nhân
              </h3>
            </div>

            <Info label="Họ tên" value={customer.fullName} />
            <Info label="Số điện thoại" value={customer.phone} />
            <Info label="Email" value={customer.email} />
            <Info label="Địa chỉ" value={customer.address} />
          </section>

          <section className="space-y-4 rounded-2xl border border-zinc-100 p-5">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Car className="size-4 text-[#b8955a]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Thông tin xe
              </h3>
            </div>

            <Info
              label="Mẫu xe quan tâm / đã mua"
              value="Chưa có dữ liệu"
            />
          </section>
        </div>

        <div className="flex gap-3 border-t border-zinc-200 bg-zinc-50 p-4">
          <button
            onClick={() => onOpenEdit(customer)}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 text-xs font-semibold text-white"
          >
            <Edit3 size={16} />
            Chỉnh sửa hồ sơ
          </button>

          <button
            onClick={onClose}
            className="h-10 flex-1 rounded-xl border border-zinc-300 text-xs font-semibold"
          >
            Đóng
          </button>
        </div>
      </aside>
    </div>
  );
};

const Info = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <span className="mb-1 block text-xs text-zinc-400">{label}</span>
    <p className="break-words text-xs font-semibold text-zinc-800">
      {value || "Chưa cập nhật"}
    </p>
  </div>
);