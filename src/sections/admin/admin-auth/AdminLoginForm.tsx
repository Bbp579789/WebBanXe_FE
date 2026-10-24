import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { adminAuthService } from '../../../services/api/admin/adminAuthService'; 

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export const AdminLoginForm: React.FC = () => {
  const navigate = useNavigate();
  
  // Animation state
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Kích hoạt animation khi component mount
  useEffect(() => {
    // Thêm một chút delay ban đầu để hiệu ứng đồng bộ với khung bên trái
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      localStorage.setItem('admin_access_token', 'mock_token_for_ui_testing');
      localStorage.setItem('userRole', 'admin');
      
      navigate('/admin/dashboard'); 
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Class dùng chung cho hiệu ứng nảy (Bouncy Spring)
  const bouncyTransition = "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform";

  return (
    <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-zinc-50 min-h-screen">
      <div 
        className={`w-full max-w-md bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-xl shadow-zinc-100 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
          isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
      >
        
        {/* HEADER SECTION */}
        <div className="space-y-2 mb-8">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8955a]/10 text-[#b8955a] text-[10px] uppercase font-bold tracking-widest ${bouncyTransition} delay-100 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span>CỔNG XÁC THỰC AN TOÀN</span>
          </div>
          <h2 className={`text-2xl font-bold text-zinc-950 tracking-tight ${bouncyTransition} delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Đăng nhập Hệ thống Quản trị
          </h2>
          <p className={`text-xs text-zinc-500 ${bouncyTransition} delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Vui lòng nhập định danh đại lý được ủy quyền để truy cập
          </p>
        </div>

        {errorMsg && (
          <div className={`mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300`}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL INPUT */}
          <div className={`space-y-1.5 ${bouncyTransition} delay-[400ms] ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <label className="block text-xs font-semibold text-zinc-700">
              Email hoặc Tên đăng nhập <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 z-10 transition-colors group-focus-within:text-zinc-900">
                <Mail className="size-4" />
              </span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-11 bg-zinc-50/50 text-xs font-medium transition-all focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Nhập email truy cập..."
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className={`space-y-1.5 ${bouncyTransition} delay-[500ms] ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <label className="block text-xs font-semibold text-zinc-700">
              Mật khẩu <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 z-10 transition-colors group-focus-within:text-zinc-900">
                <Lock className="size-4" />
              </span>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-11 bg-zinc-50/50 text-xs font-medium transition-all focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Nhập mật khẩu của bạn..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-900 cursor-pointer z-10 transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* QUÊN MẬT KHẨU */}
          <div className={`flex items-center justify-end text-xs pt-1 ${bouncyTransition} delay-[600ms] ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a href="#forgot" className="text-[#b8955a] font-semibold hover:text-zinc-900 transition-colors">
              Quên mật khẩu?
            </a> 
          </div>

          {/* SUBMIT BUTTON */}
          <div className={`${bouncyTransition} delay-[700ms] ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider mt-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/20 active:translate-y-0 active:scale-95"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin text-[#b8955a]" />
              ) : (
                <>
                  <span>Đăng nhập hệ thống</span>
                  <ArrowRight className="size-4 text-[#b8955a] ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* FOOTER */}
        <div className={`mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 ${bouncyTransition} delay-[800ms] ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span className="font-medium">Bảo mật 2 lớp cho đại lý</span>
          </div>
          <span className="text-zinc-400 font-medium">SSL 256-bit Encrypted</span>
        </div>

      </div>
    </div>
  );
};