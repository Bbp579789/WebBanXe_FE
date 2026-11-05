import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Building, Phone, Mail, FileText, Car, MapPin } from 'lucide-react';
import type { AdminCustomer, CustomerMembership } from '../../../types/adminCustomer.types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: AdminCustomer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [idCard, setIdCard] = useState('');
  const [membership, setMembership] = useState<CustomerMembership>('platinum');
  const [interestedCar, setInterestedCar] = useState('Mercedes-Benz GLC 300 4MATIC All-New');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage('Vui lòng nhập họ tên và số điện thoại của khách hàng!');
      return;
    }

    const initials = fullName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(-2)
      .join('')
      .toUpperCase() || 'KH';

    const newCust: AdminCustomer = {
      id: `MB-CUST-0${Math.floor(10 + Math.random() * 90)}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'khachhang@mercedes.vn',
      idCard: idCard.trim() || 'Chưa cập nhật',
      address: address.trim() || 'Showroom Phú Mỹ Hưng, TP.HCM',
      membership,
      interestedCar,
      joinDate: new Date().toLocaleDateString('vi-VN'),
      status: 'active',
      notes: notes.trim() || 'Khách hàng mới tạo từ CRM',
      avatarText: initials,
    };

    onAddCustomer(newCust);
    // Reset form
    setFullName('');
    setPhone('');
    setEmail('');
    setIdCard('');
    setAddress('');
    setNotes('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-7 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#b8955a] uppercase block">
              HỒ SƠ KHÁCH HÀNG CRM
            </span>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight mt-0.5">
              Thêm Hồ Sơ Khách Hàng Mới
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Họ và tên */}
            <div>
              <label className="font-bold text-zinc-700 block mb-1.5">
                Họ và tên khách hàng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Hoàng Long"
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="font-bold text-zinc-700 block mb-1.5">
                Số điện thoại liên hệ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0903 123 456"
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium tabular-nums"
              />
            </div>

            {/* Email định danh */}
            <div>
              <label className="font-bold text-zinc-700 block mb-1.5">
                Email định danh <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ví dụ: hoanglong@gmail.com"
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
              />
            </div>

            {/* CCCD / MST */}
            <div>
              <label className="font-bold text-zinc-700 block mb-1.5">
                Số CCCD / Hộ chiếu / MST <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="Ví dụ: 079198001234"
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium tabular-nums"
              />
            </div>

            {/* Hạng thành viên */}
            <div>
              <label className="font-bold text-zinc-700 block mb-1.5">
                Hạng thành viên VIP <span className="text-rose-500">*</span>
              </label>
              <select
                value={membership}
                onChange={(e) => setMembership(e.target.value as CustomerMembership)}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 font-semibold focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all cursor-pointer"
              >
                <option value="maybach_club">Maybach Owners Club</option>
                <option value="diamond">Diamond VIP</option>
                <option value="platinum">Platinum</option>
                <option value="standard">Standard</option>
              </select>
            </div>

            {/* Mẫu xe quan tâm */}
            <div>
              <label className="font-bold text-zinc-700 block mb-1.5">
                Mẫu xe quan tâm / Đã mua <span className="text-rose-500">*</span>
              </label>
              <select
                value={interestedCar}
                onChange={(e) => setInterestedCar(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 font-semibold focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all cursor-pointer"
              >
                <option value="Mercedes-Maybach S 680 4MATIC">Mercedes-Maybach S 680 4MATIC</option>
                <option value="Mercedes-Maybach GLS 600 4MATIC">Mercedes-Maybach GLS 600 4MATIC</option>
                <option value="Mercedes-AMG G 63 V8 Bi-Turbo">Mercedes-AMG G 63 V8 Bi-Turbo</option>
                <option value="Mercedes-AMG GT 53 4MATIC+ 4-Door">Mercedes-AMG GT 53 4MATIC+ 4-Door</option>
                <option value="Mercedes-Benz S 450 4MATIC Luxury">Mercedes-Benz S 450 4MATIC Luxury</option>
                <option value="Mercedes-Benz GLC 300 4MATIC All-New">Mercedes-Benz GLC 300 4MATIC All-New</option>
                <option value="Mercedes-Benz C 300 AMG All-New">Mercedes-Benz C 300 AMG All-New</option>
                <option value="Mercedes-Benz E 300 AMG">Mercedes-Benz E 300 AMG</option>
                <option value="Mercedes-Benz GLE 450 4MATIC">Mercedes-Benz GLE 450 4MATIC</option>
                <option value="Mercedes-Benz CLA 45 S AMG 4MATIC+">Mercedes-Benz CLA 45 S AMG 4MATIC+</option>
              </select>
            </div>

            {/* Địa chỉ */}
            <div className="col-span-2">
              <label className="font-bold text-zinc-700 block mb-1.5">
                Địa chỉ nhà / Showroom liên kết <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ví dụ: Khu biệt thự Phú Mỹ Hưng, Quận 7, TP.HCM"
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
              />
            </div>

            {/* Ghi chú */}
            <div className="col-span-2">
              <label className="font-bold text-zinc-700 block mb-1.5">
                Ghi chú yêu cầu chăm sóc khách hàng (CSKH)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Sở thích màu ngoại thất, lịch hẹn lái thử cuối tuần, ngày sinh nhật khách hàng..."
                className="w-full p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium resize-none"
              />
            </div>
          </div>

          {/* Footer Modal Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 text-xs font-semibold transition-all cursor-pointer active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-[#b8955a] text-white hover:text-[#b8955a] text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <UserPlus className="size-4" />
              <span>Lưu hồ sơ khách hàng</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
