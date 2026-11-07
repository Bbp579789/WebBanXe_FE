// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Search,
//   RotateCcw,
//   LayoutDashboard,
//   UserPlus,
//   Users,
//   Calendar,
//   Lock,
//   Pencil,
//   Trash2,
//   Eye,
//   CheckCircle2,
//   AlertTriangle,
// } from 'lucide-react';
// import type { AdminCustomer, CustomerStatus } from '../../types/adminCustomer.types';
// import { INITIAL_ADMIN_CUSTOMERS } from '../../data/adminCustomersData';
// import { AddCustomerModal } from '../../sections/admin/customers/AddCustomerModal';
// import { EditCustomerModal } from '../../sections/admin/customers/EditCustomerModal';
// import { CustomerDetailDrawer } from '../../sections/admin/customers/CustomerDetailDrawer';

// export const AdminCustomersPage: React.FC = () => {
//   const navigate = useNavigate();

//   // Hiệu ứng mở đầu mượt mà giống Dashboard
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsMounted(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   // Danh sách khách hàng trong state
//   const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_ADMIN_CUSTOMERS);

//   // Bộ lọc
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState<'all' | CustomerStatus>('all');

//   // Modals & Drawers state
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<AdminCustomer | null>(null);
//   const [viewingCustomer, setViewingCustomer] = useState<AdminCustomer | null>(null);
//   const [deletingCustomer, setDeletingCustomer] = useState<AdminCustomer | null>(null);

//   // Thông báo toast
//   const [toastMessage, setToMessage] = useState('');

//   const triggerToast = (msg: string) => {
//     setToMessage(msg);
//     setTimeout(() => setToMessage(''), 3500);
//   };

//   // Lọc danh sách khách hàng
//   const filteredCustomers = useMemo(() => {
//     return customers.filter((item) => {
//       // Lọc theo trạng thái
//       if (selectedStatus !== 'all' && item.status !== selectedStatus) {
//         return false;
//       }

//       // Lọc theo từ khóa tìm kiếm (Tên, SĐT, Email, CCCD, Xe)
//       if (searchQuery.trim()) {
//         const query = searchQuery.toLowerCase().trim();
//         const matchId = item.id.toLowerCase().includes(query);
//         const matchName = item.fullName.toLowerCase().includes(query);
//         const matchPhone = item.phone.toLowerCase().includes(query);
//         const matchEmail = item.email.toLowerCase().includes(query);
//         const matchIdCard = item.idCard.toLowerCase().includes(query);
//         const matchCar = item.interestedCar.toLowerCase().includes(query);

//         if (!matchId && !matchName && !matchPhone && !matchEmail && !matchIdCard && !matchCar) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [customers, selectedStatus, searchQuery]);

//   // Reset bộ lọc
//   const handleResetFilter = () => {
//     setSearchQuery('');
//     setSelectedStatus('all');
//   };

//   // 1. Thêm khách hàng mới
//   const handleAddCustomer = (newCustomer: AdminCustomer) => {
//     setCustomers((prev) => [newCustomer, ...prev]);
//     triggerToast(`Đã thêm khách hàng "${newCustomer.fullName}" thành công!`);
//   };

//   // 2. Lưu chỉnh sửa thông tin khách hàng
//   const handleSaveEditCustomer = (updatedCustomer: AdminCustomer) => {
//     setCustomers((prev) =>
//       prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
//     );
//     if (viewingCustomer && viewingCustomer.id === updatedCustomer.id) {
//       setViewingCustomer(updatedCustomer);
//     }
//     triggerToast(`Đã cập nhật hồ sơ khách hàng "${updatedCustomer.fullName}" thành công!`);
//   };

//   // 3. Chỉnh nhanh trạng thái hoạt động (bằng nút bút hoặc nút trạng thái)
//   const handleToggleStatus = (id: string) => {
//     setCustomers((prev) =>
//       prev.map((c) => {
//         if (c.id === id) {
//           const nextStatus: CustomerStatus = c.status === 'active' ? 'locked' : 'active';
//           const statusText = nextStatus === 'active' ? 'Đang hoạt động' : 'Đang khóa';
//           triggerToast(`Đã chuyển trạng thái của "${c.fullName}" sang: ${statusText}`);
//           return { ...c, status: nextStatus };
//         }
//         return c;
//       })
//     );
//   };

//   // 4. Xóa tài khoản khách hàng
//   const handleConfirmDeleteCustomer = () => {
//     if (!deletingCustomer) return;
//     const targetName = deletingCustomer.fullName;
//     setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
//     if (viewingCustomer && viewingCustomer.id === deletingCustomer.id) {
//       setViewingCustomer(null);
//     }
//     setDeletingCustomer(null);
//     triggerToast(`Đã xóa tài khoản "${targetName}" ra khỏi hệ thống!`);
//   };

//   // Thống kê động (bỏ thẻ VIP/Maybach hạng thành viên, giữ lại 3 thẻ thống kê như cũ)
//   const stats = useMemo(() => {
//     const total = 1270 + customers.length; // Baseline 1.280
//     const testDriveCount = 24;
//     const lockedCount = customers.filter((c) => c.status === 'locked').length;

//     return {
//       total: total.toLocaleString('vi-VN'),
//       testDriveCount,
//       lockedCount,
//     };
//   }, [customers]);

//   const statCardsData = [
//     {
//       title: 'Tổng số khách hàng',
//       value: stats.total,
//       unit: 'khách hàng',
//       sub: '+18% so với tháng trước',
//       subColor: 'text-emerald-600 bg-emerald-50',
//       icon: Users,
//       iconColor: 'bg-zinc-200/50 text-zinc-600',
//     },
//     {
//       title: 'Lịch hẹn lái thử hôm nay',
//       value: stats.testDriveCount,
//       unit: 'lượt hẹn',
//       sub: '18 đã xác nhận',
//       subColor: 'text-zinc-500 bg-zinc-100',
//       icon: Calendar,
//       iconColor: 'bg-zinc-200/50 text-zinc-600',
//     },
//     {
//       title: 'Tài khoản đang tạm khóa',
//       value: stats.lockedCount,
//       unit: 'tài khoản',
//       sub: 'Đang kiểm tra',
//       subColor: 'text-zinc-500 bg-zinc-100',
//       icon: Lock,
//       iconColor: 'bg-zinc-200/50 text-zinc-600',
//     },
//   ];

//   return (
//     <div className="flex-1 flex flex-col h-full bg-zinc-50 overflow-hidden select-none font-sans">

//       {/* ======================================================== */}
//       {/* 1. KHU VỰC CỐ ĐỊNH PHÍA TRÊN (ĐỒNG NHẤT MÀU & HIỆU ỨNG)    */}
//       {/* ======================================================== */}
//       <div 
//         className={`shrink-0 bg-white border-b border-zinc-200/80 px-8 pt-5 pb-4 space-y-4 shadow-2xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
//           isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
//         }`}
//       >

//         {/* Top Header Thanh điều hướng phụ */}
//         <div className="flex items-center justify-between gap-4">
//           {/* Ô tìm kiếm nhanh top bar */}
//           <div className="relative w-80">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Tìm kiếm khách hàng..."
//               className="w-full h-9 pl-9 pr-3.5 rounded-full bg-zinc-100/80 border border-zinc-200/60 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-[#b8955a] transition-all"
//             />
//           </div>

//           {/* Nút Về Dashboard */}
//           <button
//             type="button"
//             onClick={() => navigate('/admin/dashboard')}
//             className="h-9 px-4 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white hover:text-[#b8955a] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
//           >
//             <LayoutDashboard className="size-3.5" />
//             <span>Về Dashboard</span>
//           </button>
//         </div>

//         {/* Tiêu đề trang & Nút Thêm Khách Hàng (Dóng thẳng lề trái) */}
//         <div className="flex items-end justify-between pt-1">
//           <div className="text-left">
//             <p className="text-[11px] tracking-wider text-[#b8955a] uppercase font-bold text-left block">
//               Hệ thống điều hành / Quản lý khách hàng (CRM)
//             </p>
//             <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mt-1 text-left">
//               Quản Lý Khách Hàng (CRM)
//             </h1>
//           </div>

//           <button
//             type="button"
//             onClick={() => setIsAddModalOpen(true)}
//             className="h-10 px-5 rounded-2xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-[#b8955a] text-white hover:text-[#b8955a] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
//           >
//             <UserPlus className="size-4" />
//             <span>Thêm khách hàng mới</span>
//           </button>
//         </div>

//         {/* 3 Thẻ Thống Kê (Bỏ thẻ hạng thành viên, giữ lại các thẻ thống kê như cũ) */}
//         <div className="grid grid-cols-3 gap-4 pt-1">
//           {statCardsData.map((card, idx) => (
//             <div
//               key={idx}
//               className={`rounded-2xl p-4 flex items-center justify-between bg-zinc-50/70 border border-zinc-200/80 shadow-2xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform hover:-translate-y-0.5 ${
//                 isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-98'
//               }`}
//               style={{ transitionDelay: `${idx * 70}ms` }}
//             >
//               <div className="text-left">
//                 <p className="text-xs font-medium text-zinc-500">
//                   {card.title}
//                 </p>
//                 <div className="flex items-baseline gap-2 mt-1">
//                   <span className="text-xl font-bold text-zinc-900 tabular-nums">{card.value}</span>
//                   <span className="text-xs text-zinc-500">{card.unit}</span>
//                 </div>
//                 <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${card.subColor}`}>
//                   {card.sub}
//                 </span>
//               </div>
//               <div className={`size-10 rounded-xl flex items-center justify-center ${card.iconColor}`}>
//                 <card.icon className="size-5" />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Thanh công cụ Tìm kiếm chi tiết & Bộ lọc */}
//         <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
//           {/* Ô tìm kiếm đa năng */}
//           <div className="relative flex-1 min-w-[280px]">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Tìm theo tên, số điện thoại, email, CCCD..."
//               className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all shadow-2xs"
//             />
//           </div>

//           {/* Dropdown Lọc Trạng Thái */}
//           <div className="w-52">
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value as 'all' | CustomerStatus)}
//               className="w-full h-10 px-3 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:outline-none focus:border-[#b8955a] transition-all cursor-pointer shadow-2xs"
//             >
//               <option value="all">Tất cả trạng thái</option>
//               <option value="active">Đang hoạt động</option>
//               <option value="locked">Đang khóa</option>
//             </select>
//           </div>

//           {/* Nút Thiết lập lại */}
//           <button
//             type="button"
//             onClick={handleResetFilter}
//             className="h-10 px-4 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
//             title="Khôi phục bộ lọc mặc định"
//           >
//             <RotateCcw className="size-3.5 text-zinc-500" />
//             <span>Thiết lập lại</span>
//           </button>
//         </div>

//       </div>

//       {/* Thông báo Toast khi thao tác thành công */}
//       {toastMessage && (
//         <div className="bg-emerald-600 text-white px-8 py-2.5 flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200 shadow-md">
//           <CheckCircle2 className="size-4 shrink-0" />
//           <span>{toastMessage}</span>
//         </div>
//       )}

//       {/* ======================================================== */}
//       {/* 2. KHU VỰC BẢNG DỮ LIỆU CUỘN LÊN XUỐNG VỚI HIỆU ỨNG MƯỢT  */}
//       {/* ======================================================== */}
//       <div className="flex-1 overflow-y-auto pl-8 pr-[22px] py-5">
//         <div 
//           className={`bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
//             isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-98'
//           }`}
//         >

//           <div className="w-full overflow-x-hidden">
//             <table className="w-full text-left border-collapse table-fixed">
//               {/* Định nghĩa tỷ lệ cố định từng cột bằng colgroup để bảng luôn đều và chuẩn 100% */}
//               <colgroup>
//                 <col className="w-[8%]" />
//                 <col className="w-[16%]" />
//                 <col className="w-[10%]" />
//                 <col className="w-[18%]" />
//                 <col className="w-[16%]" />
//                 <col className="w-[7%]" />
//                 <col className="w-[13%]" />
//                 <col className="w-[12%]" />
//               </colgroup>

//               {/* Tiêu đề cột dính cố định khi cuộn bảng */}
//               <thead className="sticky top-0 bg-zinc-50/95 backdrop-blur-xs z-10 border-b border-zinc-200/80">
//                 <tr className="text-[11px] uppercase tracking-wider text-zinc-500">
//                   <th className="py-3.5 pl-4 pr-1.5 font-bold whitespace-nowrap">Mã KH</th>
//                   <th className="py-3.5 px-2 font-bold whitespace-nowrap">Họ và Tên</th>
//                   <th className="py-3.5 px-2 font-bold whitespace-nowrap">Điện Thoại</th>
//                   <th className="py-3.5 px-2 font-bold">Email / Địa Chỉ</th>
//                   <th className="py-3.5 px-2 font-bold">Dòng Xe Quan Tâm</th>
//                   <th className="py-3.5 px-2 font-bold whitespace-nowrap text-center">Ngày</th>
//                   <th className="py-3.5 px-2 font-bold whitespace-nowrap text-center">Trạng Thái</th>
//                   <th className="py-3.5 px-2 font-bold whitespace-nowrap text-center">Thao Tác</th>
//                 </tr>
//               </thead>

//               {/* Danh sách các dòng dữ liệu */}
//               <tbody className="divide-y divide-zinc-100 text-xs">
//                 {filteredCustomers.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="py-16 text-center text-zinc-400">
//                       <div className="flex flex-col items-center justify-center gap-2">
//                         <Users className="size-8 text-zinc-300" />
//                         <p className="text-sm font-medium text-zinc-600">Không tìm thấy hồ sơ khách hàng nào</p>
//                         <p className="text-xs text-zinc-400">Hãy thử đổi từ khóa tìm kiếm hoặc lọc lại trạng thái</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredCustomers.map((cust, idx) => {
//                     const isActive = cust.status === 'active';

//                     return (
//                       <tr
//                         key={cust.id}
//                         className={`hover:bg-zinc-50/80 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform group ${
//                           isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
//                         }`}
//                         style={{ transitionDelay: `${150 + idx * 40}ms` }}
//                       >
//                         {/* Mã KH */}
//                         <td className="py-3.5 pl-4 pr-1.5 whitespace-nowrap">
//                           <span className="font-semibold text-zinc-900 group-hover:text-[#b8955a] transition-colors font-mono text-[11px] tracking-tight">
//                             {cust.id}
//                           </span>
//                         </td>

//                         {/* Họ và Tên (Avatar + Tên) */}
//                         <td className="py-3.5 px-2">
//                           <div className="flex items-center gap-2.5 min-w-0">
//                             <div className="size-7.5 shrink-0 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 text-[#b8955a] font-bold text-[10.5px] flex items-center justify-center shadow-2xs border border-[#b8955a]/30">
//                               {cust.avatarText || cust.fullName.substring(0, 2).toUpperCase()}
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <p className="font-bold text-zinc-900 leading-snug truncate text-xs">{cust.fullName}</p>
//                               <p className="text-[11px] text-zinc-400 mt-0.5 truncate">CCCD: {cust.idCard}</p>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Điện Thoại (Đồng bộ font-medium text-zinc-700 text-xs) */}
//                         <td className="py-3.5 px-2 font-medium text-zinc-700 whitespace-nowrap tabular-nums text-xs">
//                           {cust.phone}
//                         </td>

//                         {/* Email / Địa Chỉ */}
//                         <td className="py-3.5 px-2 min-w-0">
//                           <p className="font-bold text-zinc-900 leading-snug truncate text-xs">{cust.email}</p>
//                           <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{cust.address}</p>
//                         </td>

//                         {/* Dòng Xe Quan Tâm */}
//                         <td className="py-3.5 px-2 min-w-0">
//                           <p className="font-bold text-zinc-900 leading-snug truncate text-xs">{cust.interestedCar}</p>
//                           {cust.notes && (
//                             <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{cust.notes}</p>
//                           )}
//                         </td>

//                         {/* Ngày (Đồng bộ font-medium text-zinc-600 text-xs text-center) */}
//                         <td className="py-3.5 px-2 text-zinc-600 whitespace-nowrap tabular-nums font-medium text-xs text-center">
//                           {cust.joinDate}
//                         </td>

//                         {/* Trạng Thái (Đồng bộ py-0.5 text-[11px] text-center) */}
//                         <td className="py-3.5 px-2 whitespace-nowrap text-center">
//                           <div className="flex items-center justify-center">
//                             <button
//                               type="button"
//                               onClick={() => handleToggleStatus(cust.id)}
//                               className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
//                                 isActive
//                                   ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
//                                   : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200/70'
//                               }`}
//                               title="Bấm để chuyển đổi nhanh trạng thái"
//                             >
//                               <span
//                                 className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`}
//                               />
//                               <span>{isActive ? 'Đang hoạt động' : 'Đang khóa'}</span>
//                             </button>
//                           </div>
//                         </td>

//                         {/* Thao Tác (Đồng bộ size-7 icon size-3.5 căn giữa) */}
//                         <td className="py-3.5 px-2 text-center whitespace-nowrap">
//                           <div className="inline-flex items-center justify-center gap-1.5">
//                             {/* 1. Nút Con Mắt: Xem chi tiết hồ sơ */}
//                             <button
//                               type="button"
//                               onClick={() => setViewingCustomer(cust)}
//                               className="size-7 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
//                               title="Xem chi tiết hồ sơ"
//                             >
//                               <Eye className="size-3.5" />
//                             </button>

//                             {/* 2. Nút Icon Cái Bút: Chuyển đổi trạng thái */}
//                             <button
//                               type="button"
//                               onClick={() => handleToggleStatus(cust.id)}
//                               className="size-7 rounded-lg bg-zinc-100 hover:bg-[#b8955a]/15 text-zinc-600 hover:text-[#8a6e3d] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
//                               title="Chỉnh nhanh: Chuyển đổi Đang hoạt động / Đang khóa"
//                             >
//                               <Pencil className="size-3.5" />
//                             </button>

//                             {/* 3. Nút Thùng Rác: Xóa tài khoản */}
//                             <button
//                               type="button"
//                               onClick={() => setDeletingCustomer(cust)}
//                               className="size-7 rounded-lg bg-zinc-100 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
//                               title="Xóa tài khoản"
//                             >
//                               <Trash2 className="size-3.5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer thông tin số lượng bảng */}
//           <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
//             <span>
//               Hiển thị <strong className="text-zinc-800">{filteredCustomers.length}</strong> / {customers.length} khách hàng
//             </span>
//             <span className="text-xs text-zinc-400">Mercedes-Benz Customer Relationship Management</span>
//           </div>

//         </div>
//       </div>

//       {/* ======================================================== */}
//       {/* 3. CÁC MODAL & DRAWER TƯƠNG TÁC                         */}
//       {/* ======================================================== */}

//       {/* Modal Thêm Hồ Sơ Khách Hàng Mới */}
//       <AddCustomerModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//         onAddCustomer={handleAddCustomer}
//       />

//       {/* Drawer Xem Chi Tiết Hồ Sơ Khách Hàng (Đã xóa dấu X, giữ lại nút Chỉnh sửa và nút Đóng) */}
//       <CustomerDetailDrawer
//         customer={viewingCustomer}
//         isOpen={!!viewingCustomer}
//         onClose={() => setViewingCustomer(null)}
//         onOpenEdit={(cust) => {
//           setViewingCustomer(null);
//           setEditingCustomer(cust);
//         }}
//       />

//       {/* Modal Chỉnh Sửa Hồ Sơ Khách Hàng (Mở từ nút Chỉnh sửa trong Drawer) */}
//       <EditCustomerModal
//         customer={editingCustomer}
//         isOpen={!!editingCustomer}
//         onClose={() => setEditingCustomer(null)}
//         onSaveCustomer={handleSaveEditCustomer}
//       />

//       {/* Hộp thoại xác nhận xóa tài khoản */}
//       {deletingCustomer && (
//         <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
//           <div
//             className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
//             onClick={() => setDeletingCustomer(null)}
//           />
//           <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 z-10 animate-in zoom-in-95 duration-200 text-center space-y-4">
//             <div className="size-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
//               <AlertTriangle className="size-6" />
//             </div>

//             <div>
//               <h3 className="text-base font-bold text-zinc-900">
//                 Xác nhận xóa tài khoản khách hàng?
//               </h3>
//               <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
//                 Bạn có chắc chắn muốn xóa hồ sơ khách hàng{' '}
//                 <strong className="text-zinc-900">{deletingCustomer.fullName}</strong> (Mã:{' '}
//                 {deletingCustomer.id}) ra khỏi hệ thống CRM không?
//               </p>
//               <p className="text-[11px] text-rose-500 font-semibold mt-1">
//                 Lưu ý: Thao tác này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác.
//               </p>
//             </div>

//             <div className="flex items-center justify-center gap-3 pt-2">
//               <button
//                 type="button"
//                 onClick={() => setDeletingCustomer(null)}
//                 className="h-10 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-all cursor-pointer active:scale-95"
//               >
//                 Hủy bỏ
//               </button>
//               <button
//                 type="button"
//                 onClick={handleConfirmDeleteCustomer}
//                 className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-1.5"
//               >
//                 <Trash2 className="size-4" />
//                 <span>Xác nhận xóa</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminCustomersPage;


import React, { useMemo, useState, useEffect  } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Users,
} from "lucide-react";

import type { AdminCustomer } from "../../types/adminCustomer.types";

import { useAdminCustomers } from "../../hooks/admin/useCustomer";
import { customerService } from "../../services/api/admin/customerService";
import { getBackendId } from "../../services/api/admin/adminCustomerMapper";

import { AddCustomerModal } from "../../sections/admin/customers/AddCustomerModal";
import { EditCustomerModal } from "../../sections/admin/customers/EditCustomerModal";
import { CustomerDetailDrawer } from "../../sections/admin/customers/CustomerDetailDrawer";

const AdminCustomersPage: React.FC = () => {
  const {
    customers,
    loading,
    error,
    fetchCustomers,
    setCustomers,
  } = useAdminCustomers();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

  const [selectedCustomer, setSelectedCustomer] =
    useState<AdminCustomer | null>(null);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return customers;

    return customers.filter((customer) =>
      [
        customer.id,
        customer.fullName,
        customer.phone,
        customer.email,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [customers, search]);
const totalCustomers = filteredCustomers.length;

const totalPages = Math.max(
  1,
  Math.ceil(totalCustomers / pageSize)
);

const paginatedCustomers = useMemo(() => {
  const startIndex = (currentPage - 1) * pageSize;

  return filteredCustomers.slice(
    startIndex,
    startIndex + pageSize
  );
}, [filteredCustomers, currentPage, pageSize]);

const startItem =
  totalCustomers === 0 ? 0 : (currentPage - 1) * pageSize + 1;

const endItem = Math.min(
  currentPage * pageSize,
  totalCustomers
);

// Khi tìm kiếm hoặc thay đổi bộ lọc, quay về trang đầu
useEffect(() => {
  setCurrentPage(1);
}, [search, pageSize]);

// Nếu xóa khách hàng khiến trang hiện tại không còn dữ liệu,
// tự động quay về trang hợp lệ gần nhất.
useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);
  const handleAddCustomer = (customer: AdminCustomer) => {
    setCustomers((prev) => [...prev, customer]);
  };

  const handleSaveCustomer = async (updated: AdminCustomer) => {
    const id = getBackendId(updated.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Mã khách hàng không hợp lệ.");
    }

    await customerService.updateCustomer(id, {
      full_name: updated.fullName,
      phone: updated.phone,
      email: updated.email,
      address: updated.address,
    });

    await fetchCustomers();
  };

  const handleDeleteCustomer = async (customer: AdminCustomer) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa khách hàng ${customer.fullName}?`
    );

    if (!confirmed) return;

    try {
      const id = getBackendId(customer.id);

      await customerService.deleteCustomer(id);

      setCustomers((prev) =>
        prev.filter((item) => item.id !== customer.id)
      );

      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer(null);
        setDetailOpen(false);
      }

      alert("Xóa khách hàng thành công.");
    } catch (error: any) {
      console.error("[CRM] Delete customer error:", error);

      alert(
        error?.response?.data?.message ||
        "Không thể xóa khách hàng."
      );
    }
  };

  const openDetail = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    setDetailOpen(true);
  };

  const openEdit = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    setDetailOpen(false);
    setEditOpen(true);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto min-h-0 bg-zinc-50 font-sans">
      <main className="p-8 pb-16 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold text-[#b8955a] uppercase tracking-wider mb-1">
              Hệ thống điều hành / Quản lý khách hàng
            </p>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
              Quản Lý Khách Hàng
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchCustomers}
              disabled={loading}
              className="h-9 px-4 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200/80 text-zinc-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-[#b8955a]" : "text-zinc-500"} />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="h-9 px-4 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white hover:text-[#b8955a] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus size={15} />
              <span>Thêm khách hàng</span>
            </button>
          </div>
        </div>

        {/* SEARCH & STATS ROW */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="w-full h-10 rounded-2xl border border-zinc-200/80 bg-white py-2 pl-10 pr-4 text-xs text-zinc-800 shadow-xs outline-none transition focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10"
            />
          </div>

          {/* TỔNG KHÁCH HÀNG BADGE / CARD */}
          <div className="flex items-center gap-3 self-start rounded-2xl border border-zinc-200/80 bg-white px-5 py-2.5 shadow-xs sm:self-auto">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-500">Tổng khách hàng</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-zinc-900 tabular-nums">{customers.length}</span>
                <span className="text-[11px] text-zinc-400">tài khoản</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            {error}
            <button
              onClick={fetchCustomers}
              className="ml-2 font-bold underline cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* CUSTOMERS TABLE */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
              <thead className="bg-zinc-50/90 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4">Mã KH</th>
                  <th className="px-6 py-4">Họ tên</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {loading && customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400 font-medium">
                      Đang tải dữ liệu khách hàng...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400">
                      Không tìm thấy khách hàng.
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="transition-colors hover:bg-zinc-50/80 group"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-[#b8955a]">
                        {customer.id}
                      </td>

                      <td className="px-6 py-4 font-bold text-zinc-900 group-hover:text-[#b8955a] transition-colors">
                        {customer.fullName}
                      </td>

                      <td className="px-6 py-4 text-zinc-600 font-medium tabular-nums">
                        {customer.phone || "Chưa cập nhật"}
                      </td>

                      <td className="px-6 py-4 text-zinc-600">
                        {customer.email || "Chưa cập nhật"}
                      </td>

                      <td className="px-6 py-4 text-zinc-600 tabular-nums">
                        {customer.joinDate || "Chưa cập nhật"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Đã đăng ký
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetail(customer)}
                            title="Xem chi tiết"
                            className="size-7.5 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEdit(customer)}
                            title="Chỉnh sửa"
                            className="size-7.5 rounded-lg bg-zinc-100 hover:bg-[#b8955a]/15 text-zinc-600 hover:text-[#8a6e3d] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCustomer(customer)}
                            title="Xóa khách hàng"
                            className="size-7.5 rounded-lg bg-zinc-100 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang đồng bộ */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 px-6 py-3.5 text-xs text-zinc-500 bg-zinc-50/50">
            <div>
              Hiển thị <strong className="text-zinc-800">{startItem}-{endItem}</strong> trên tổng số <strong className="text-zinc-800">{totalCustomers}</strong> khách hàng
              <span className="ml-1 text-zinc-400">(Tổng: {customers.length})</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 whitespace-nowrap">Số dòng:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700 outline-none focus:border-[#b8955a]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-3 rounded-lg border border-zinc-200 bg-white font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
                >
                  Trước
                </button>
                <span className="px-2 font-semibold text-zinc-800">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 px-3 rounded-lg border border-zinc-200 bg-white font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>

      <AddCustomerModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      <CustomerDetailDrawer
        customer={selectedCustomer}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onOpenEdit={openEdit}
      />

      <EditCustomerModal
        customer={selectedCustomer}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSaveCustomer={handleSaveCustomer}
      />
    </div>
  );
};

export default AdminCustomersPage;