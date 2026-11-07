import React from 'react';

export const OrderHeaderSection: React.FC = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 font-sans">
    <div className="min-w-0">
      <span className="block text-[10px] sm:text-[11px] font-serif tracking-[0.25em] uppercase text-[#a9854c] mb-2">
        MERCEDES-BENZ AUTHORIZED
      </span>

      <h1 className="text-3xl sm:text-4xl text-zinc-500 mt-6 leading-6 font-normal">
  Hợp đồng đặt xe
</h1>

      <p className="text-xs sm:text-sm text-zinc-500 mt-8 leading-6 font-normal">
        Theo dõi đơn đặt xe, hợp đồng đặt cọc và lịch trình bàn giao
        phương tiện của quý khách.
      </p>
    </div>

    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-emerald-200/80 bg-emerald-50/70 text-emerald-800 text-[10px] sm:text-[11px] font-semibold tracking-wide whitespace-nowrap self-start sm:self-center shrink-0">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-50 animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>

      Hỗ trợ khách hàng trực tuyến
    </div>
  </div>
);