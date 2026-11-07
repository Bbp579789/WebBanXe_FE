import React from 'react';

export const OrderHeaderSection: React.FC = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-serif font-bold text-zinc-950 tracking-tight">
        Vehicle Orders & Reservations
      </h1>
      <p className="text-sm text-zinc-500 mt-1.5">
        Track vehicle allocations, deposit contracts, and handover schedules.
      </p>
    </div>
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wide">
      <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Concierge Support Available
    </div>
  </div>
);