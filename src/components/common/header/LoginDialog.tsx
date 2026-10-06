import React, { useState } from 'react';
import { Eye, EyeOff, Info, X } from 'lucide-react';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    onLoginSuccess(account.trim());
    setAccount('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Nền tối đen phía sau */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Container chính căn giữa */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-200">

        {/* Nút đóng nhanh góc trên bên phải */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-zinc-400 hover:text-white transition"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 1. KHU VỰC LOGO & BRAND (Nằm bên ngoài card trắng) */}
        <div className="flex flex-col items-center mb-6 text-center">
          {/* Logo hình thoi trong vòng tròn trắng */}
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg mb-3">
            <svg
              className="h-5 w-5 stroke-zinc-950 fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" transform="rotate(45 12 12)" />
            </svg>
          </div>

          {/* Tên thương hiệu in hoa[cite: 3] */}
          <h1 className="text-xl font-bold tracking-[0.25em] text-white uppercase font-sans">
            Mercedes-Benz
          </h1>

          {/* Slogan thương hiệu[cite: 3] */}
          <p className="text-[9px] tracking-[0.22em] text-zinc-400 uppercase mt-1">
            Artisanal Jewelry & Home
          </p>
        </div>

        {/* 2. KHUNG CARD MÀU TRẮNG BO GÓC LỚN[cite: 3] */}
        <div className="w-full bg-white rounded-[28px] p-8 sm:p-9 shadow-2xl text-zinc-900">

          {/* Tiêu đề & Icon info[cite: 3] */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-sans text-zinc-900 tracking-tight">
              Log in
            </h2>
            <button
              type="button"
              className="text-zinc-400 hover:text-zinc-600 transition"
              title="Thông tin trợ giúp"
            >
              <Info className="h-5 w-5 stroke-[1.8]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">


            {/* 1. Input Email / Phone Number (Đã tắt nút Edit) */}
            <div className="relative">
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Email/PhoneNumber"
                className="w-full h-13 px-4 text-sm rounded-xl bg-zinc-100/90 text-zinc-900 placeholder:text-zinc-500 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none transition"
              />
            </div>

            {/* 2. Input Password (Chỉ dùng 1 con mắt duy nhất) */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <label className="text-xs font-medium text-zinc-700">
                  Password <span className="text-rose-500 font-bold">*</span>
                </label>
                <a
                  href="#forgot"
                  className="text-xs font-medium text-sky-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full h-13 pl-4 pr-12 text-sm rounded-xl bg-zinc-100/90 text-zinc-900 placeholder:text-zinc-500 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none transition [&&::-ms-reveal]:hidden [&&::-ms-clear]:hidden ${showPassword ? 'tracking-normal font-sans' : 'tracking-widest font-mono'
                    }`}
                />

                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  className={`absolute right-3.5 z-20 p-1.5 transition cursor-pointer select-none rounded-full hover:bg-zinc-200/60 ${showPassword ? 'text-zinc-900' : 'text-zinc-400'
                    }`}
                  aria-label="Ẩn hiện mật khẩu"
                >
                  <Eye className="h-4 w-4 stroke-[1.8]" />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium px-1 pt-1">{error}</p>
            )}

            {/* Nút bấm Log In màu vàng đất bo tròn[cite: 3] */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#af8d55] hover:bg-[#9d7d49] active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-[#af8d55]/20"
              >
                Login
              </button>
            </div>

            {/* Dòng liên kết Đăng ký[cite: 3] */}
            <p className="text-center text-xs text-zinc-500 pt-2 font-normal">
              Don't have a MER-BEN account yet?{' '}
              <a
                href="#register"
                className="text-sky-600 font-medium hover:underline ml-0.5"
              >
                Create one
              </a>
            </p>
          </form>
        </div>

        {/* 3. CHÂN TRANG PHÁP LÝ DƯỚI CÙNG[cite: 3] */}
        <div className="flex items-center gap-2 mt-6 text-[11px] text-zinc-400 font-medium">
          <a href="#provider" className="hover:text-zinc-200 transition">Provider</a>
          <span>•</span>
          <a href="#legal" className="hover:text-zinc-200 transition">Legal Notice</a>
          <span>•</span>
          <a href="#privacy" className="hover:text-zinc-200 transition">Privacy & Cookies</a>
        </div>

      </div>
    </div>
  );
};