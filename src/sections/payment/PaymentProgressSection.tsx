import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface PaymentProgressProps {
  step: number;
}

export const PaymentProgressSection: React.FC<PaymentProgressProps> = ({ step }) => {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#b8955a] uppercase font-bold">
            ATELIER RESERVATION CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mt-1">
            {step === 1 ? 'Điểm Giao Xe & Hồ Sơ Đứng Tên' : 'Đặt Cọc Trực Tuyến'}
          </h1>
        </div>
        <p className="text-xs text-zinc-500 font-light max-w-xs text-left md:text-right">
          Xác lập thông tin pháp lý chủ sở hữu và cá nhân hóa nghi thức nhận xe độc bản của bạn.
        </p>
      </div>

      {/* Thanh tiến trình */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50 min-w-max">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <div>
            <p className="text-[10px] font-bold text-zinc-900">01. Giỏ hàng & Cấu hình - Tùy chọn</p>
            <p className="text-[9px] text-emerald-600 font-medium">Đã hoàn thành</p>
          </div>
        </div>

        <div className="w-8 h-px bg-zinc-200 shrink-0" />

        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border min-w-max transition-colors ${step === 1 ? 'border-zinc-900 bg-white shadow-sm' : 'border-zinc-200 bg-zinc-50/50'}`}>
          {step === 2 ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Circle className="size-4 text-zinc-900 fill-zinc-900" />}
          <div>
            <p className="text-[10px] font-bold text-zinc-900">02. Điểm giao xe & Hồ sơ</p>
            <p className={`text-[9px] font-medium ${step === 1 ? 'text-zinc-500' : 'text-emerald-600'}`}>
              {step === 1 ? 'Đang thiết lập' : 'Đã hoàn thành'}
            </p>
          </div>
        </div>

        <div className="w-8 h-px bg-zinc-200 shrink-0" />

        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border min-w-max transition-colors ${step === 2 ? 'border-zinc-900 bg-white shadow-sm' : 'border-transparent opacity-50'}`}>
          <Circle className={`size-4 ${step === 2 ? 'text-zinc-900 fill-zinc-900' : 'text-zinc-400'}`} />
          <div>
            <p className="text-[10px] font-bold text-zinc-900">03. Đặt cọc trực tuyến</p>
            <p className="text-[9px] font-medium text-zinc-500">
              {step === 2 ? 'Đang thiết lập' : 'Bước tiếp theo'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};