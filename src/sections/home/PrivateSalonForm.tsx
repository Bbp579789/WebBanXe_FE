// import React, { useState } from 'react';
// import { Key, Phone, ShieldCheck } from 'lucide-react';
// import { Button } from '../ui/button';
// import { MAYBACH_PRODUCTS } from './MaybachShowcase';


// export const PrivateSalonForm: React.FC = () => {
//   const [salonForm, setSalonForm] = useState({
//     user_name: '',
//     phone: '',
//     vehicle_id: MAYBACH_PRODUCTS[0].id,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!salonForm.user_name || !salonForm.phone) {
//       alert('Vui lòng điền đầy đủ Quý danh và Số điện thoại.');
//       return;
//     }
//     alert(`Quản gia Valoir đã tiếp nhận thông tin từ Quý khách ${salonForm.user_name}. Chúng tôi sẽ kết nối trong thời gian sớm nhất.`);
//   };

//   return (
//     <section className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pt-28">
//       <div className="rounded-[36px] bg-[#141416] text-white p-8 sm:p-14 lg:p-16 border border-zinc-800 shadow-2xl relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-[#b8955a]/10 rounded-full blur-3xl pointer-events-none" />

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
//           {/* Left Text[cite: 4] */}
//           <div className="lg:col-span-7 space-y-6">
//             <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono tracking-widest text-[#b8955a] uppercase font-semibold">
//               <Key className="size-3" />
//               <span>PRIVATE SALON ADMITTANCE</span>
//             </div>

//             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
//               Trải Nghiệm Phòng Chờ Thượng Khách Valoir Maybach
//             </h2>

//             <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-light">
//               Được thiết kế theo tiêu chuẩn Atelier thế giới tại 123 Đại Lộ Lê Lợi, Q.1, TP. Hồ Chí Minh. Chúng tôi đón tiếp từng quý khách riêng biệt để tư vấn bảng cấu hình Manufaktur độc quyền.
//             </p>

//             <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-300">
//               <div className="flex items-center gap-2">
//                 <Phone className="size-4 text-[#b8955a]" />
//                 <span>Hotline VIP: 1900 8888</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <ShieldCheck className="size-4 text-[#b8955a]" />
//                 <span>100% Bảo mật danh tính</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Form[cite: 4] */}
//           <div className="lg:col-span-5">
//             <div className="bg-[#1c1c1f] rounded-2xl border border-zinc-800 p-6 sm:p-8 shadow-xl">
//               <h3 className="text-lg font-serif font-bold text-white mb-5 tracking-wide">
//                 Đăng ký Cố vấn Maybach VIP
//               </h3>

//               <form onSubmit={handleSubmit} className="space-y-4 text-left">
//                 <div>
//                   <label className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
//                     QUÝ DANH CỦA QUÝ KHÁCH
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={salonForm.user_name}
//                     onChange={(e) => setSalonForm({ ...salonForm, user_name: e.target.value })}
//                     placeholder="VD: Chủ tịch Nguyễn Tuấn Anh"
//                     className="w-full h-11 px-4 text-xs rounded-xl bg-[#141416] text-white placeholder:text-zinc-600 border border-zinc-800 focus:border-[#b8955a] focus:outline-none transition"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
//                     SỐ ĐIỆN THOẠI LIÊN HỆ
//                   </label>
//                   <input
//                     type="tel"
//                     required
//                     value={salonForm.phone}
//                     onChange={(e) => setSalonForm({ ...salonForm, phone: e.target.value })}
//                     placeholder="+84 90 000 0000"
//                     className="w-full h-11 px-4 text-xs rounded-xl bg-[#141416] text-white placeholder:text-zinc-600 border border-zinc-800 focus:border-[#b8955a] focus:outline-none transition font-mono"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
//                     DÒNG XE MAYBACH MONG MUỐN
//                   </label>
//                   <select
//                     value={salonForm.vehicle_id}
//                     onChange={(e) => setSalonForm({ ...salonForm, vehicle_id: Number(e.target.value) })}
//                     className="w-full h-11 px-3 text-xs rounded-xl bg-[#141416] text-white border border-zinc-800 focus:border-[#b8955a] focus:outline-none transition"
//                   >
//                     {MAYBACH_PRODUCTS.map((car) => (
//                       <option key={car.id} value={car.id}>
//                         {car.brand} {car.model}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="pt-2">
//                   <Button
//                     type="submit"
//                     variant="brand"
//                     className="w-full h-12 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md shadow-[#b8955a]/10"
//                   >
//                     GỬI THÔNG TIN CHO QUẢN GIA SALON
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };