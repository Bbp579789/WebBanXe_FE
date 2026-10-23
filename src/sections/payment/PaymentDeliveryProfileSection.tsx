import React, { useState, useEffect } from 'react';
import { Building2, Home } from 'lucide-react';

export const PaymentDeliveryProfileSection: React.FC = () => {
  // State lưu thông tin tài khoản (Tự động điền)
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    email: ''
  });

  // State lưu phương thức giao xe (Mặc định chọn nhận tại Lounge)
  const [deliveryMethod, setDeliveryMethod] = useState<'atelier' | 'home'>('atelier');

  // Lấy dữ liệu tài khoản từ localStorage khi component được mount
 useEffect(() => {
    const loadProfileData = () => {
      const savedName = localStorage.getItem('userName') || '';
      const savedEmail = localStorage.getItem('userEmail') || ''; 
      const savedPhone = localStorage.getItem('userPhone') || ''; 
      
      setProfile({
        fullName: savedName,
        email: savedEmail,
        phone: savedPhone,
      });
    };

    // 1. Tải dữ liệu lần đầu khi vào trang
    loadProfileData();

    // 2. Tự động tải lại dữ liệu nếu người dùng đăng nhập ngay tại trang này
    window.addEventListener('authChange', loadProfileData);

    return () => {
      window.removeEventListener('authChange', loadProfileData);
    };
  }, []);
  return (
    <div className="space-y-6">
      {/* 1. Hồ sơ đứng tên */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-2 py-1 bg-zinc-100 text-[10px] font-mono font-bold text-zinc-800 rounded">MỤC 01 / 02</span>
          <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">Pháp lý sở hữu</span>
        </div>
        <h2 className="text-xl font-serif font-bold text-zinc-950 mb-1">
          1. Thông Tin Hồ Sơ Đứng Tên Xe
        </h2>
        <p className="text-xs text-zinc-500 mb-6">
          Thông tin liên hệ chính thức để đăng ký hồ sơ và xuất hóa đơn GTGT.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider">Họ và tên chủ xe *</label>
            <input 
              type="text" 
              value={profile.fullName}
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
              placeholder="Nhập họ và tên..."
              className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider">Số điện thoại *</label>
            <input 
              type="text" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              placeholder="Nhập số điện thoại..."
              className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider">Email nhận hợp đồng *</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              placeholder="Nhập email..."
              className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-zinc-400 focus:bg-white transition" 
            />
          </div>
        </div>
      </div>

      {/* 2. Phương thức nhận xe */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-2 py-1 bg-zinc-100 text-[10px] font-mono font-bold text-zinc-800 rounded">MỤC 02 / 02</span>
          <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">Nghi thức bàn giao</span>
        </div>
        <h2 className="text-xl font-serif font-bold text-zinc-950 mb-1">
          2. Phương Thức Tiếp Nhận Xe
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Lựa chọn 1: Atelier Lounge */}
          <div 
            onClick={() => setDeliveryMethod('atelier')}
            className={`p-5 rounded-2xl border-2 cursor-pointer relative transition-all duration-200 ${
              deliveryMethod === 'atelier' 
                ? 'border-zinc-900 bg-white shadow-sm' 
                : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-400'
            }`}
          >
            <div className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded ${
              deliveryMethod === 'atelier' ? 'text-emerald-700 bg-emerald-100' : 'text-zinc-500 bg-zinc-200/60'
            }`}>
              Miễn phí
            </div>
            <Building2 className={`size-6 mb-3 ${deliveryMethod === 'atelier' ? 'text-zinc-900' : 'text-zinc-400'}`} />
            <h3 className={`text-sm font-bold ${deliveryMethod === 'atelier' ? 'text-zinc-900' : 'text-zinc-600'}`}>
              Bàn giao tại Atelier Lounge
            </h3>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Nghi thức khai xe trong phòng VIP riêng tư sang trọng, tiệc rượu Champagne thượng hạng.
            </p>
          </div>

          {/* Lựa chọn 2: Home Delivery */}
          <div 
            onClick={() => setDeliveryMethod('home')}
            className={`p-5 rounded-2xl border-2 cursor-pointer relative transition-all duration-200 ${
              deliveryMethod === 'home' 
                ? 'border-zinc-900 bg-white shadow-sm' 
                : 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-400'
            }`}
          >
            <div className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded ${
              deliveryMethod === 'home' ? 'text-[#b8955a] bg-[#b8955a]/10' : 'text-zinc-500 bg-zinc-200/60'
            }`}>
              +3.000.000 đ
            </div>
            <Home className={`size-6 mb-3 ${deliveryMethod === 'home' ? 'text-zinc-900' : 'text-zinc-400'}`} />
            <h3 className={`text-sm font-bold ${deliveryMethod === 'home' ? 'text-zinc-900' : 'text-zinc-600'}`}>
              Bàn giao tận tư gia (Home Delivery)
            </h3>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Vận chuyển xe chuyên dụng kín bạt cách ly tuyệt đối, bàn giao trực tiếp tại nhà.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};