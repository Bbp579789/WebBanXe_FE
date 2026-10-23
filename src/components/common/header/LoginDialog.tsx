import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Info, X, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { Icon } from '../../ui/icon';
import type { LoginDialogProps } from '../../../types/header.types';
import { Link } from 'react-router-dom';

export const LoginDialog: React.FC<LoginDialogProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Tự động điền email nếu người dùng vừa đăng ký xong
  useEffect(() => {
    if (isOpen) {
      const savedEmail = sessionStorage.getItem('registeredEmail');
      const savedMsg = sessionStorage.getItem('registerSuccess');
      
      if (savedEmail) {
        setAccount(savedEmail);
        sessionStorage.removeItem('registeredEmail'); // Dùng xong thì xóa
      }
      if (savedMsg) {
        setSuccessMsg(savedMsg);
        sessionStorage.removeItem('registerSuccess');
      }
    } else {
      // Reset state khi đóng Dialog
      setError(null);
      setSuccessMsg(null);
      setAccount('');
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // XỬ LÝ GỌI API BACKEND ĐĂNG NHẬP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/login', {
        email: account.trim(),
        password: password.trim()
      });

    // Lấy Token và User từ Response (Tùy cấu trúc Backend trả về)
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;

      if (token) {
        localStorage.setItem('access_token', token);
      }
      
      // 1. Lấy thông tin Tên
      const userName = user?.full_name || user?.name || account.trim().split('@')[0];
      localStorage.setItem('userName', userName);

      // 2. LƯU THÊM EMAIL VÀ PHONE ĐỂ TỰ ĐỘNG ĐIỀN Ở TRANG THANH TOÁN
      localStorage.setItem('userEmail', user?.email || account.trim());
      localStorage.setItem('userPhone', user?.phone || '');

      // 3. Cập nhật lại UI Header (Đổi nút Đăng nhập thành Avatar/Tên)
      window.dispatchEvent(new Event('authChange'));
      
      // 4. Cập nhật lại Giỏ hàng (Đổi từ giỏ hàng khách sang giỏ hàng của user này)
      window.dispatchEvent(new Event('cartChange'));
 
      onLoginSuccess(userName);
      onClose();
    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err?.response?.data);
      const backendMessage = 
        err?.response?.data?.error || 
        err?.response?.data?.message || 
        'Tài khoản hoặc mật khẩu không chính xác!';
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-zinc-400 hover:text-white transition cursor-pointer"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Khối thương hiệu phía trên */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-14 w-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center p-2.5 text-[#b8955a] shadow-xl mb-3">
            <Icon name="logo" className="w-full h-full" />
          </div>

          <h1 className="text-xl font-bold tracking-[0.25em] text-white uppercase font-serif">
            MERCEDES-BENZ
          </h1>
          <p className="text-[9px] tracking-[0.22em] text-zinc-400 uppercase font-mono mt-1">
            Authorized Dealer Portal
          </p>
        </div>

        {/* Khung Card đăng nhập màu trắng */}
        <div className="w-full bg-white rounded-[28px] p-8 sm:p-9 shadow-2xl text-zinc-900">
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

          {/* Thông báo đăng ký thành công */}
          {successMsg && !error && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-700 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email" // Chuyển thành type="email" cho chuẩn xác
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full h-13 px-4 text-sm rounded-xl bg-zinc-100/90 text-zinc-900 placeholder:text-zinc-500 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none transition"
              />
            </div>

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
                  required
                  className={`w-full h-13 pl-4 pr-12 text-sm rounded-xl bg-zinc-100/90 text-zinc-900 placeholder:text-zinc-500 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none transition [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${
                    showPassword ? 'tracking-normal font-sans' : 'tracking-widest font-mono'
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
                  className="absolute right-3.5 z-10 p-1 text-zinc-400 hover:text-zinc-700 transition cursor-pointer select-none"
                  aria-label="Ẩn hiện mật khẩu"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-zinc-900 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-zinc-400 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Báo lỗi từ Backend */}
            {error && (
              <p className="text-xs text-rose-500 font-medium px-1 pt-1">{error}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#af8d55] hover:bg-[#9d7d49] active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-[#af8d55]/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : 'Log In'}
              </button>
            </div>

            <p className="text-center text-xs text-zinc-500 pt-2 font-normal">
              Don't have a MER-BEN account yet?{' '}
              <Link
                to="/register"
                onClick={() => onClose?.()}
                className="text-[#b8955a] font-medium hover:underline ml-0.5 cursor-pointer"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>

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