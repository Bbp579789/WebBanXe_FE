import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Save } from 'lucide-react';
import type { AdminCustomer, CustomerMembership, CustomerStatus } from '../../../types/adminCustomer.types';

interface EditCustomerModalProps {
  customer: AdminCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (updatedCustomer: AdminCustomer) => void;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  customer,
  isOpen,
  onClose,
  onSaveCustomer,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [idCard, setIdCard] = useState('');
  const [membership, setMembership] = useState<CustomerMembership>('platinum');
  const [interestedCar, setInterestedCar] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('active');
  const [notes, setNotes] = useState('');

  // Trạng thái modal xác nhận phụ
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName);
      setPhone(customer.phone);
      setEmail(customer.email);
      setIdCard(customer.idCard);
      setMembership(customer.membership);
      setInterestedCar(customer.interestedCar);
      setAddress(customer.address);
      setStatus(customer.status);
      setNotes(customer.notes || '');
      setShowConfirmStep(false);
      setErrorMessage('');
    }
  }, [customer, isOpen]);

  if (!isOpen || !customer) return null;

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage('Họ và tên và số điện thoại không được để trống!');
      return;
    }
    // Mở hộp thoại xác nhận
    setShowConfirmStep(true);
  };

  const handleConfirmSave = () => {
    const initials = fullName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(-2)
      .join('')
      .toUpperCase() || 'KH';

    const updated: AdminCustomer = {
      ...customer,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      idCard: idCard.trim(),
      membership,
      interestedCar,
      address: address.trim(),
      status,
      notes: notes.trim(),
      avatarText: initials,
    };

    onSaveCustomer(updated);
    setShowConfirmStep(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={() => {
          if (!showConfirmStep) onClose();
        }}
      />

      {/* Modal Dialog Chính */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-7 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-widest text-[#b8955a] uppercase">
                HỒ SƠ KHÁCH HÀNG CRM
              </span>
              <span className="size-1 rounded-full bg-zinc-300" />
              <span className="text-xs font-semibold text-zinc-500">{customer.id}</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight mt-0.5">
              Chỉnh Sửa Hồ Sơ Khách Hàng
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
        <form onSubmit={handlePreSubmit} className="p-7 space-y-5">
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
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
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
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium tabular-nums"
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
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
              />
            </div>

            {/* CCCD / MST */}
          

            {/* Hạng thành viên */}
            {/* <div>
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
            </div> */}

            {/* Trạng thái tài khoản */}
            <div>
              <label className="font-bold text-zinc-700 block mb-1.5">
                Trạng thái hoạt động <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 font-semibold focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all cursor-pointer"
              >
                <option value="active">Đang hoạt động</option>
                <option value="locked">Đang khóa</option>
              </select>
            </div>

            {/* Mẫu xe quan tâm */}
            {/* <div className="col-span-2">
              <label className="font-bold text-zinc-700 block mb-1.5">
                Mẫu xe quan tâm / Đã mua <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={interestedCar}
                onChange={(e) => setInterestedCar(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
              />
            </div> */}

            {/* Địa chỉ */}
            <div className="col-span-2">
              <label className="font-bold text-zinc-700 block mb-1.5">
                Địa chỉ nhà / Showroom liên kết <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium"
              />
            </div>

            {/* Ghi chú */}
            {/* <div className="col-span-2">
              <label className="font-bold text-zinc-700 block mb-1.5">
                Ghi chú yêu cầu chăm sóc khách hàng (CSKH)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all font-medium resize-none"
              />
            </div> */}
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
              <Save className="size-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>

      </div>

      {/* ======================================================== */}
      {/* MODAL XÁC NHẬN CẬP NHẬT PHỤ (CONFIRMATION STEP)         */}
      {/* ======================================================== */}
      {showConfirmStep && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            onClick={() => setShowConfirmStep(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6 z-10 animate-in zoom-in-95 duration-200 text-center space-y-4">
            <div className="size-12 rounded-full bg-[#fdf8f0] border border-[#f0e2cc] text-[#b8955a] flex items-center justify-center mx-auto">
              <AlertCircle className="size-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Xác nhận lưu thay đổi?
              </h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn cập nhật các thông tin mới cho khách hàng{' '}
                <strong className="text-zinc-800">{fullName}</strong> (Mã: {customer.id}) không?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmStep(false)}
                className="h-9 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              >
                Kiểm tra lại
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="h-9 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-[#b8955a] text-white hover:text-[#b8955a] text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Check className="size-4" />
                <span>Đồng ý lưu</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
