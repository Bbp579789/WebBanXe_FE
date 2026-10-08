import React, { useState } from 'react';
import { Icon } from '../ui/icon';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(`Cảm ơn quý khách. Hệ thống đã lưu nhận bản tin cho email: ${email}`);
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#f8f8f7] text-zinc-600 border-t border-zinc-200/80 pt-16 pb-8 transition-colors select-none">
      <div className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl">
        {/* 4 CỘT NỘI DUNG CHÍNH */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-zinc-200">

          {/* CỘT 1: THƯƠNG HIỆU & HOTLINE HỖ TRỢ */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              {/* Icon logo thương hiệu ngôi sao */}
              <div className="size-10 rounded-full border border-[#b8955a] flex items-center justify-center p-1.5 text-[#b8955a] bg-white shadow-sm shrink-0">
                <Icon name="logo" className="size-full" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-sm font-semibold tracking-[0.2em] font-serif uppercase text-zinc-900">
                  Mercedes-Benz
                </span>
                <span className="text-[9px] tracking-[0.18em] text-[#b8955a] uppercase font-mono mt-1 font-semibold">
                  Authorized Dealer Portal
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-zinc-600">
              Cổng thông tin ủy quyền xe hạng sang và hiệu năng cao. Trải nghiệm đặc quyền dịch vụ thượng lưu, tư vấn phiên bản cá nhân hóa Bespoke cùng chuyên viên chuyên trách.
            </p>

            <div className="text-xs space-y-1.5 pt-1 text-zinc-700">
              <p>
                Hotline VIP: <span className="font-semibold text-zinc-900 tracking-wider">1900 888 668</span>
              </p>
              <p>
                Email: <span className="text-zinc-600 font-mono text-[11px]">concierge@mercedes-benz-portal.vn</span>
              </p>
            </div>

            {/* Trạng thái trực tuyến */}
            <div className="flex items-center gap-2 pt-1 text-xs font-medium text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
              <span>Chuyên viên trực tuyến sẵn sàng 24/7</span>
            </div>
          </div>

          {/* CỘT 2: DỊCH VỤ ĐẶC QUYỀN */}
          <div className="flex flex-col space-y-4 lg:pl-4">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-900 font-serif">
              Dịch vụ
            </h4>
            <ul className="space-y-3 text-xs text-zinc-600">
              <li>
                <a href="#service-booking" className="hover:text-[#b8955a] transition-colors">
                  Đặt Lịch Bảo Dưỡng & Sửa Chữa
                </a>
              </li>
              <li>
                <a href="#test-drive" className="hover:text-[#b8955a] transition-colors">
                  Đăng Ký Lái Thử Tại Nhà
                </a>
              </li>
              <li>
                <a href="#tracking" className="hover:text-[#b8955a] transition-colors">
                  Theo Dõi Tiến Độ Bàn Giao Xe
                </a>
              </li>
              <li>
                <a href="#concierge" className="hover:text-[#b8955a] transition-colors">
                  Dịch Vụ Concierge Trợ Lý Riêng
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 3: BỘ SƯU TẬP & PHÂN KHÚC */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-900 font-serif">
              Đặc quyền & Bộ Sưu Tập
            </h4>
            <ul className="space-y-3 text-xs text-zinc-600">
              <li>
                <a href="#maybach" className="hover:text-[#b8955a] transition-colors">
                  Mercedes-Maybach Cao Cấp
                </a>
              </li>
              <li>
                <a href="#amg" className="hover:text-[#b8955a] transition-colors">
                  Mercedes-AMG Hiệu Năng Cao
                </a>
              </li>
              <li>
                <a href="#eq-electric" className="hover:text-[#b8955a] transition-colors">
                  Hệ Sinh Thái Xe Thuần Điện EQ
                </a>
              </li>
              <li>
                <a href="#bespoke" className="hover:text-[#b8955a] transition-colors">
                  Cá Nhân Hóa Manufaktur (Bespoke)
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 4: BẢN TIN (INPUT + NÚT GỬI KẾ BÊN) */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-900 font-serif">
              Bản tin thượng lưu
            </h4>
            <p className="text-xs leading-relaxed text-zinc-600">
              Nhận thư mời các sự kiện ra mắt xe độc quyền và thông tin phân bổ hạn mức mua trước.
            </p>

            {/* <form onSubmit={handleSubscribe} className="pt-1">
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của quý khách..."
                  className="flex-1 bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:border-[#b8955a] text-xs h-10 shadow-sm"
                />
                <Button
                  type="submit"
                  variant="brand"
                  className="h-10 px-5 rounded-xl font-bold tracking-wider text-[11px] shadow-sm shrink-0 uppercase"
                >
                  Gửi
                </Button>
              </div>
            </form> */}
          </div>
        </div>

        {/* DÒNG COPYRIGHT & CHÍNH SÁCH DƯỚI CÙNG */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
          <div>
            © 2026 Mercedes-Benz Authorized Portal. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#privacy" className="hover:text-zinc-900 transition-colors">
              Bảo Mật Dữ Liệu Khách Hàng
            </a>
            <a href="#terms" className="hover:text-zinc-900 transition-colors">
              Điều Khoản Dịch Vụ
            </a>
            <a href="#dealer" className="hover:text-zinc-900 transition-colors">
              Chứng Nhận Ủy Quyền
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;