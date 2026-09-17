// src/components/common/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f6f5f3] text-[#4b4946] border-t border-[#e8e6e1] pt-14 pb-8 transition-colors">
      <div className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl">
        {/* KHU VỰC CÁC CỘT THÔNG TIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-10 pb-12 border-b border-[#e5e3de]">
          {/* CỘT 1: THƯƠNG HIỆU & LIÊN HỆ */}
          <div className="flex flex-col space-y-4">
            {/* Logo & Tên Portal */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-[#b8955a] flex items-center justify-center p-1 text-[#b8955a] shrink-0">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v20M12 12L3.5 7M12 12l8.5-5M12 12L4 18M12 12l8 6" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  style={{ fontFamily: "'Merriweather', serif" }}
                  className="text-xs font-semibold tracking-[0.22em] text-[#1c1a17] uppercase"
                >
                  Mercedes-Benz
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#b8955a] uppercase font-medium">
                  Authorized Dealer Portal
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[#6c6963]">
              Cổng thông tin khách hàng ủy quyền chính thức. Trải nghiệm dịch vụ xa xỉ phẩm và phong cách sống thượng lưu với đặc quyền bespoke chuyên biệt.
            </p>

            <div className="text-xs space-y-1.5 pt-1 text-[#55524c]">
              <p>
                Hotline VIP: <span className="font-semibold text-[#1c1a17]">1900 888 668</span>
              </p>
              <p>
                Email: <span className="text-[#3b3834]">concierge@mercedes-benz-portal.vn</span>
              </p>
            </div>

            {/* Trạng thái hỗ trợ */}
            <div className="flex items-center gap-2 pt-2 text-xs font-medium text-[#0f8b5f]">
              <span className="h-2 w-2 rounded-full bg-[#0f8b5f] inline-block animate-pulse" />
              <span>Chuyên viên trực tuyến sẵn sàng hỗ trợ 24/7</span>
            </div>
          </div>

          {/* CỘT 2: DỊCH VỤ */}
          <div className="flex flex-col space-y-4 lg:pl-6">
            <h4
              style={{ fontFamily: "'Merriweather', serif" }}
              className="text-sm font-extrabold tracking-[0.2em] uppercase text-black"
            >
              Dịch vụ
            </h4>
            <ul className="space-y-3.5 text-xs text-[#55524c]">
              <li>
                <a href="#concierge" className="hover:text-[#b8955a] transition">
                  Dịch Vụ Concierge
                </a>
              </li>
              <li>
                <a href="#theodoidon" className="hover:text-[#b8955a] transition">
                  Theo Dõi Đơn Hàng
                </a>
              </li>
              <li>
                <a href="#baoduong" className="hover:text-[#b8955a] transition">
                  Lịch Bảo Dưỡng Trang Sức & Xe
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 3: ĐẶC QUYỀN */}
          <div className="flex flex-col space-y-4">
            <h4
              style={{ fontFamily: "'Merriweather', serif" }}
              className="text-sm font-extrabold tracking-[0.2em] uppercase text-black"
            >
              Đặc quyền
            </h4>
            <ul className="space-y-3.5 text-xs text-[#55524c]">
              <li>
                <a href="#circlevip" className="hover:text-[#b8955a] transition">
                  Mercedes-Benz Circle VIP
                </a>
              </li>
              <li>
                <a href="#bosuutap" className="hover:text-[#b8955a] transition">
                  Bộ Sưu Tập Giới Hạn
                </a>
              </li>
              <li>
                <a href="#giacong" className="hover:text-[#b8955a] transition">
                  Gia Công Theo Yêu Cầu
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 4: BẢN TIN */}
          <div className="flex flex-col space-y-4">
            <h4
              style={{ fontFamily: "'Merriweather', serif" }}
              className="text-sm font-extrabold tracking-[0.2em] uppercase text-black"
            >
              Bản tin
            </h4>
            <p className="text-xs leading-relaxed text-[#6c6963]">
              Cập nhật thông tin đặc quyền về các bộ sưu tập mới và các sự kiện khách hàng danh dự được thông báo trực tiếp qua trợ lý AI và tổng đài viên Concierge.
            </p>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & CHÍNH SÁCH */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#78756e] gap-4">
          <div>
            © 2024 Mercedes-Benz Authorized Portal. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#baomat" className="hover:text-black transition">
              Bảo Mật Thông Tin
            </a>
            <a href="#dieukhoan" className="hover:text-black transition">
              Điều Khoản Dịch Vụ
            </a>
            <a href="#chungnhan" className="hover:text-black transition">
              Chứng Nhận Đại Lý Ủy Quyền
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;