import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Icon } from '../components/ui/icon';
import { Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    country: 'Vietnam',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với Điều khoản dịch vụ.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.email.split('@')[0];
    localStorage.setItem('userName', fullName);
    window.dispatchEvent(new Event('authChange'));

    alert('Đăng ký tài khoản thành công!');
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0d0e11] text-zinc-100 flex flex-col justify-center items-center py-10 px-6 select-none overflow-x-hidden font-sans">
      {/* Background Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Nút Home / Register cố định ở góc trên cùng bên trái */}
      <nav
        aria-label="Breadcrumb"
        className="fixed top-6 left-6 z-40 inline-flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg"
      >
        <Link
          to="/"
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <Icon name="home" className="size-3.5" />
          <span>Home</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-[#b8955a] font-medium">Register</span>
      </nav>

      {/* KHỐI FORM TRUNG TÂM */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo thương hiệu */}
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

        {/* Thẻ Form */}
        <Card className="w-full bg-white text-zinc-900 rounded-[28px] border-none shadow-2xl shadow-black/80 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-zinc-950">
                Create your account
              </h2>
              <button type="button" className="text-zinc-400 hover:text-zinc-600 transition" title="Thông tin">
                <Icon name="info" className="size-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  placeholder="customer@valoir.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl bg-zinc-50 border-sky-500 text-zinc-900 focus-visible:ring-1 focus-visible:ring-sky-500"
                />
              </div>


              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="rounded-xl bg-zinc-100 border-transparent pr-10 text-zinc-900 focus:bg-white focus:border-zinc-300 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-zinc-900" />
                    ) : (
                      <Eye className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="rounded-xl bg-zinc-100 border-transparent pr-10 text-zinc-900 focus:bg-white focus:border-zinc-300 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-zinc-900 transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 text-zinc-400 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-500">
                Your login credentials are required to secure your account. A 6-digit verification code will be sent to the provided email to complete setup.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Sarah"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="rounded-xl bg-zinc-100 border-transparent text-zinc-900 focus:bg-white focus:border-zinc-300"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Jenkins"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="rounded-xl bg-zinc-100 border-transparent text-zinc-900 focus:bg-white focus:border-zinc-300"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2.5">
                  <label htmlFor="terms" className="relative flex items-center justify-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeTerms}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, agreeTerms: e.target.checked })
                      }
                      className="peer sr-only"
                    />

                    {/* Ô vuông viền hiển thị trạng thái */}
                    <div className={`size-4 rounded border flex items-center justify-center transition-all ${formData.agreeTerms
                        ? 'bg-[#0284c7] border-[#0284c7] text-white'
                        : 'border-zinc-500 bg-transparent hover:border-zinc-300'
                      }`}>
                      {/* Icon dấu tích khi được chọn */}
                      {formData.agreeTerms && (
                        <svg
                          className="size-3 stroke-current stroke-[2.5] fill-none"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </label>

                  <label htmlFor="terms" className="text-[12px] text-zinc-300 cursor-pointer select-none flex items-center gap-1">
                    <span>I agree to the following</span>
                    <a href="#terms" className="text-sky-500 hover:underline font-medium">
                      Terms of Use
                    </a>
                    <span className="text-rose-500">*</span>
                  </label>
                </div>

                <p className="text-[10px] text-zinc-400 mt-2 leading-normal">
                  Your personal data will be used to support your experience throughout this website. Read our{' '}
                  <a href="#privacy" className="text-sky-600 underline font-medium">
                    Privacy Policy
                  </a>{' '}
                  for details.
                </p>


              </div>

              <Button
                type="submit"
                className="w-full mt-3 h-11 rounded-xl bg-[#b8955a] hover:bg-[#a47f48] active:scale-[0.99] text-white font-medium text-xs tracking-wider transition-all shadow-md cursor-pointer"
              >
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-5 text-xs text-zinc-400">
          Already have an account?{' '}
          <Link to="/" className="text-white font-medium underline hover:text-[#b8955a] transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;