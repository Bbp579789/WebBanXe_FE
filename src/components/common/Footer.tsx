
import React from 'react';
import { Icon } from '../ui/icon';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f8f8f7] text-zinc-600 border-t border-zinc-200/80 pt-16 pb-8 font-sans antialiased">
      <div className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl">

        {/* 4 CỘT NỘI DUNG CHÍNH */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-zinc-200">

          {/* CỘT 1: THƯƠNG HIỆU */}
          <div className="flex flex-col space-y-4">

            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full border border-[#b8955a] flex items-center justify-center p-1.5 text-[#b8955a] bg-white shadow-sm shrink-0">
                <Icon name="logo" className="size-full" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-sm font-bold tracking-[0.12em] uppercase text-zinc-900 leading-tight">
                  Mercedes-Benz
                </span>

                <span className="text-[9px] tracking-[0.12em] text-[#b8955a] uppercase font-semibold mt-1">
                  Authorized Dealer Portal
                </span>
              </div>
            </div>

            <p className="text-[13px] leading-7 font-normal text-zinc-600">
              Cổng thông tin ủy quyền xe hạng sang và hiệu năng cao.
              Trải nghiệm đặc quyền dịch vụ thượng lưu, tư vấn phiên bản
              cá nhân.
            </p>

            <div className="text-[13px] space-y-2 pt-1 text-zinc-700">
              <p>
                Hotline:{' '}
                <span className="font-bold text-zinc-900 tracking-wide">
                  1900 888 888
                </span>
              </p>

              <p className="break-words">
                Email:{' '}
                <span className="text-zinc-600 text-xs">
                  concierge@mercedesbenzportal.vn
                </span>
              </p>
            </div>

            {/* TRẠNG THÁI TRỰC TUYẾN */}
            <div className="flex items-start gap-2 pt-1 text-xs font-medium text-emerald-700">
              <span className="size-2 mt-1 rounded-full bg-emerald-600 shrink-0 animate-pulse" />
              <span className="leading-5">
                Chuyên viên trực tuyến sẵn sàng 24/7
              </span>
            </div>
          </div>

          {/* CỘT 2: DÒNG XE */}
          <div className="flex flex-col space-y-5 lg:pl-4">

            <h4 className="text-[13px] font-bold tracking-[0.08em] uppercase text-zinc-900">
              Những cỗ máy hiện đại
            </h4>

            <ul className="space-y-4 text-[13px] text-zinc-600 font-normal">
              <li>
                <h1>
                  Mercedes-Benz C-Class
                </h1>
              </li>

              <li>
                <h1>
                  Mercedes-Maybach
                </h1>

              </li>

              <li>
                <h1>
                  Mercedes-Benz S-Class
                </h1>
              </li>

              <li>
                <h1>
                  Mercedes-Benz E-Class
                </h1>
              </li>
            </ul>
          </div>

          {/* CỘT 3: CHAT */}
          <div className="flex flex-col space-y-5">

            <h4 className="text-[13px] font-bold tracking-[0.08em] uppercase text-zinc-900">
              Chăm sóc khách hàng
            </h4>

            <ul className="space-y-4 text-[13px] text-zinc-600 font-normal">
              <h1>  Mercedes-Benz mang đến trải nghiệm hỗ trợ khách hàng hiện đại và thuận tiện thông qua hai kênh chăm sóc trực tuyến: Telegram và Chatbot AI tích hợp trên website.

                Hỗ trợ qua Telegram: Kết nối trực tiếp với đội ngũ tư vấn viên để giải đáp thắc mắc, cung cấp thông tin về các dòng xe, chính sách bán hàng và hỗ trợ khách hàng trong quá trình mua xe.
              </h1>
            </ul>
          </div>

          {/* CỘT 4: BẢN TIN */}
          <div className="flex flex-col space-y-5">

            <h4 className="text-[13px] font-bold tracking-[0.08em] uppercase text-zinc-900">
              THANH TOÁN TRỰC TUYẾN
            </h4>
            <ul className="space-y-4 text-[13px] text-zinc-600 font-normal">
              <li>
                <h1>
                  Thanh toán trực tuyến: Hỗ trợ thực hiện giao dịch đặt cọc và thanh toán thông qua cổng thanh toán VNPay.
                  Giao dịch nhanh chóng: Quy trình thanh toán được tích hợp trực tiếp trên website, giúp tiết kiệm thời gian và thao tác.
                </h1>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT & CHÍNH SÁCH */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-5">

          <p className="text-center leading-6">
            © 2026 Mercedes-Benz Authorized Portal. All rights reserved.
          </p>


        </div>

      </div>
    </footer>
  );
};

export default Footer;