import React, { useState } from 'react';
import { Eye, Info, X } from 'lucide-react';
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Email/PhoneNumber"
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
                  className={`w-full h-13 pl-4 pr-12 text-sm rounded-xl bg-zinc-100/90 text-zinc-900 placeholder:text-zinc-500 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none transition [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${showPassword ? 'tracking-normal font-sans' : 'tracking-widest font-mono'
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
                  <Eye className={`h-4 w-4 transition-colors ${showPassword ? 'text-zinc-900' : 'text-zinc-400'}`} />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium px-1 pt-1">{error}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#af8d55] hover:bg-[#9d7d49] active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-[#af8d55]/20 cursor-pointer"
              >
                Log In
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