// import React, { useState } from 'react';
// import { X, UserPlus, Sparkles, Building, Phone, Mail, FileText, Car, MapPin } from 'lucide-react';
// import type { AdminCustomer, CustomerMembership } from '../../../types/adminCustomer.types';

// interface AddCustomerModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddCustomer: (customer: AdminCustomer) => void;
// }

// export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
//   isOpen,
//   onClose,
//   onAddCustomer,
// }) => {
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [idCard, setIdCard] = useState('');
//   const [membership, setMembership] = useState<CustomerMembership>('platinum');
//   const [interestedCar, setInterestedCar] = useState('Mercedes-Benz GLC 300 4MATIC All-New');
//   const [address, setAddress] = useState('');
//   const [notes, setNotes] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!fullName.trim() || !phone.trim()) {
//       setErrorMessage('Vui lòng nhập họ tên và số điện thoại của khách hàng!');
//       return;
//     }

//     const initials = fullName
//       .trim()
//       .split(' ')
//       .map((w) => w[0])
//       .filter(Boolean)
//       .slice(-2)
//       .join('')
//       .toUpperCase() || 'KH';

//     const newCust: AdminCustomer = {
//       id: `MB-CUST-0${Math.floor(10 + Math.random() * 90)}`,
//       fullName: fullName.trim(),
//       phone: phone.trim(),
//       email: email.trim() || 'khachhang@mercedes.vn',
//       idCard: idCard.trim() || 'Chưa cập nhật',
//       address: address.trim() || 'Showroom Phú Mỹ Hưng, TP.HCM',
//       membership,
//       interestedCar,
//       joinDate: new Date().toLocaleDateString('vi-VN'),
//       status: 'active',
//       notes: notes.trim() || 'Khách hàng mới tạo từ CRM',
//       avatarText: initials,
//     };

//     onAddCustomer(newCust);
//     // Reset form
//     setFullName('');
//     setPhone('');
//     setEmail('');
//     setIdCard('');
//     setAddress('');
//     setNotes('');
//     setErrorMessage('');
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans select-none">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
//         onClick={onClose}
//       />

//       {/* Modal Dialog */}
//       <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
//         {/* Header Modal */}
//         <div className="px-7 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
//           <div>
//             <span className="text-[11px] font-bold tracking-widest text-[#b8955a] uppercase block">
//               HỒ SƠ KHÁCH HÀNG CRM
//             </span>
//             <h2 className="text-xl font-bold text-zinc-900 tracking-tight mt-0.5">
//               Thêm Hồ Sơ Khách Hàng Mới
//             </h2>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="size-9 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 flex items-center justify-center transition-all cursor-pointer"
//           >
//             <X className="size-5" />
//           </button>
//         </div>

//         {/* Form Body */}
//         <form onSubmit={handleSubmit} className="p-7 space-y-5">
//           {errorMessage && (
//             <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
//               {errorMessage}
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-4 text-xs">
//             {/* Họ và tên */}
//             <div>
//               <label className="font-bold text-zinc-700 block mb-1.5">
//                 Họ và tên khách hàng <span className="text-rose-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 placeholder="Ví dụ: Nguyễn Hoàng Long"
//                 className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
//               />
//             </div>

//             {/* Số điện thoại */}
//             <div>
//               <label className="font-bold text-zinc-700 block mb-1.5">
//                 Số điện thoại liên hệ <span className="text-rose-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="Ví dụ: 0903 123 456"
//                 className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium tabular-nums"
//               />
//             </div>

//             {/* Email định danh */}
//             <div>
//               <label className="font-bold text-zinc-700 block mb-1.5">
//                 Email định danh <span className="text-rose-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Ví dụ: hoanglong@gmail.com"
//                 className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
//               />
//             </div>

//             {/* CCCD / MST */}
//             <div>
//               <label className="font-bold text-zinc-700 block mb-1.5">
//                 Số CCCD / Hộ chiếu / MST <span className="text-rose-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={idCard}
//                 onChange={(e) => setIdCard(e.target.value)}
//                 placeholder="Ví dụ: 079198001234"
//                 className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium tabular-nums"
//               />
//             </div>

//             {/* Hạng thành viên */}
//             <div>
//               <label className="font-bold text-zinc-700 block mb-1.5">
//                 Hạng thành viên VIP <span className="text-rose-500">*</span>
//               </label>
//               <select
//                 value={membership}
//                 onChange={(e) => setMembership(e.target.value as CustomerMembership)}
//                 className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 font-semibold focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all cursor-pointer"
//               >
//                 <option value="maybach_club">Maybach Owners Club</option>
//                 <option value="diamond">Diamond VIP</option>
//                 <option value="platinum">Platinum</option>
//                 <option value="standard">Standard</option>
//               </select>
//             </div>

//             {/* Mẫu xe quan tâm */}
//             <div>
//               <label className="font-bold text-zinc-700 block mb-1.5">
//                 Mẫu xe quan tâm / Đã mua <span className="text-rose-500">*</span>
//               </label>
//               <select
//                 value={interestedCar}
//                 onChange={(e) => setInterestedCar(e.target.value)}
//                 className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 font-semibold focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all cursor-pointer"
//               >
//                 <option value="Mercedes-Maybach S 680 4MATIC">Mercedes-Maybach S 680 4MATIC</option>
//                 <option value="Mercedes-Maybach GLS 600 4MATIC">Mercedes-Maybach GLS 600 4MATIC</option>
//                 <option value="Mercedes-AMG G 63 V8 Bi-Turbo">Mercedes-AMG G 63 V8 Bi-Turbo</option>
//                 <option value="Mercedes-AMG GT 53 4MATIC+ 4-Door">Mercedes-AMG GT 53 4MATIC+ 4-Door</option>
//                 <option value="Mercedes-Benz S 450 4MATIC Luxury">Mercedes-Benz S 450 4MATIC Luxury</option>
//                 <option value="Mercedes-Benz GLC 300 4MATIC All-New">Mercedes-Benz GLC 300 4MATIC All-New</option>
//                 <option value="Mercedes-Benz C 300 AMG All-New">Mercedes-Benz C 300 AMG All-New</option>
//                 <option value="Mercedes-Benz E 300 AMG">Mercedes-Benz E 300 AMG</option>
//                 <option value="Mercedes-Benz GLE 450 4MATIC">Mercedes-Benz GLE 450 4MATIC</option>
//                 <option value="Mercedes-Benz CLA 45 S AMG 4MATIC+">Mercedes-Benz CLA 45 S AMG 4MATIC+</option>
//               </select>
//             </div>

//             {/* Địa chỉ */}
//             <div className="col-span-2">
//               <label className="font-bold text-zinc-700 block mb-1.5">
//                 Địa chỉ nhà / Showroom liên kết <span className="text-rose-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 placeholder="Ví dụ: Khu biệt thự Phú Mỹ Hưng, Quận 7, TP.HCM"
//                 className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
//               />
//             </div>

//             {/* Ghi chú */}
//             <div className="col-span-2">
//               <label className="font-bold text-zinc-700 block mb-1.5">
//                 Ghi chú yêu cầu chăm sóc khách hàng (CSKH)
//               </label>
//               <textarea
//                 rows={3}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Sở thích màu ngoại thất, lịch hẹn lái thử cuối tuần, ngày sinh nhật khách hàng..."
//                 className="w-full p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium resize-none"
//               />
//             </div>
//           </div>

//           {/* Footer Modal Actions */}
//           <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100">
//             <button
//               type="button"
//               onClick={onClose}
//               className="h-10 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 text-xs font-semibold transition-all cursor-pointer active:scale-95"
//             >
//               Hủy bỏ
//             </button>
//             <button
//               type="submit"
//               className="h-10 px-6 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-[#b8955a] text-white hover:text-[#b8955a] text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
//             >
//               <UserPlus className="size-4" />
//               <span>Lưu hồ sơ khách hàng</span>
//             </button>
//           </div>
//         </form>

//       </div>
//     </div>
//   );
// };


import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";

import type { AdminCustomer } from "../../../types/adminCustomer.types";
import { customerService } from "../../../services/api/admin/customerService";
import { mapBackendCustomer } from "../../../services/api/admin/adminCustomerMapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: AdminCustomer) => void;
}

export const AddCustomerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFullName("");
    setUsername("");
    setPassword("");
    setPhone("");
    setEmail("");
    setAddress("");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !username.trim() ||
      !password.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await customerService.createCustomer({
        username: username.trim(),
        password,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        role: "customer",
      });

      console.log("[CRM] Created customer:", response);

      const newCustomer = mapBackendCustomer(response);

      onAddCustomer(newCustomer);

      resetForm();
      onClose();
    } catch (error: any) {
      console.error("[CRM] Create customer error:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tạo khách hàng."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 outline-none focus:bg-white focus:border-[#b8955a]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={() => !loading && onClose()}
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/70 px-7 py-5">
          <div>
            <span className="block text-[11px] font-bold tracking-widest text-[#b8955a]">
              HỒ SƠ KHÁCH HÀNG CRM
            </span>

            <h2 className="mt-1 text-xl font-bold text-zinc-900">
              Thêm Hồ Sơ Khách Hàng Mới
            </h2>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-7">
          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="mb-1.5 block font-bold text-zinc-700">
                Họ và tên *
              </label>

              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Hoàng Long"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block font-bold text-zinc-700">
                Số điện thoại *
              </label>

              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0903123456"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block font-bold text-zinc-700">
                Email *
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block font-bold text-zinc-700">
                Địa chỉ
              </label>

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ khách hàng"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block font-bold text-zinc-700">
                Tên đăng nhập *
              </label>

              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block font-bold text-zinc-700">
                Mật khẩu *
              </label>

              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="h-10 rounded-xl border border-zinc-200 px-5 text-xs font-semibold text-zinc-600"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex h-10 items-center gap-2 rounded-xl bg-zinc-950 px-6 text-xs font-semibold text-white disabled:opacity-50"
            >
              <UserPlus size={16} />
              {loading ? "Đang lưu..." : "Lưu hồ sơ khách hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};