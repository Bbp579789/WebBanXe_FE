import React from 'react';

export const OrderPaginationSection: React.FC = () => (
  <div className="flex items-center justify-center gap-2 pb-10">
    <button className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-400 text-[11px] font-bold hover:bg-zinc-50 transition" disabled>
      &lt; Prev
    </button>
    <button className="size-8 rounded-lg bg-zinc-950 text-white text-[11px] font-bold">1</button>
    <button className="size-8 rounded-lg border border-zinc-200 text-zinc-600 text-[11px] font-bold hover:bg-zinc-50 transition">2</button>
    <button className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-800 text-[11px] font-bold hover:bg-zinc-50 transition">
      Next &gt;
    </button>
  </div>
);