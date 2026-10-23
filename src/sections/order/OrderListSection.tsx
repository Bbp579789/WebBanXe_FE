import React from 'react';
import type { Order } from '../../services/api/orderService';

export const OrderListSection: React.FC<{ orders: Order[] }> = ({ orders }) => {
  if (orders.length === 0) {
    return <div className="py-20 text-center text-zinc-500 text-sm">Chưa có đơn hàng nào.</div>;
  }

  return (
    <div className="space-y-5 mb-10">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col gap-6 shadow-xs hover:shadow-md transition-shadow">
          
          {/* Top Row: Info & Status Badge */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="text-[11px] text-zinc-500 font-medium">
              <span className="text-zinc-800">Order ID {order.id}</span>
              {order.status === 'deposit' && (
                <> • Placed: {order.date} • Vehicle Value: <span className="font-bold">{order.value}</span> • Deposit Paid: <span className="text-[#b8955a] font-bold">{order.depositPaid}</span></>
              )}
              {order.status === 'transit' && (
                <> • Placed: {order.date} • Vehicle Value: <span className="font-bold">{order.value}</span> • Allocation Status: Custom Factory Build</>
              )}
              {order.status === 'delivered' && (
                <> • Completed: {order.date} • Final Invoiced: <span className="font-bold">{order.finalInvoiced}</span></>
              )}
            </div>

            {/* Status Badges */}
            {order.status === 'deposit' && (
              <span className="px-3 py-1 text-[10px] font-bold text-[#b8955a] border border-[#b8955a]/30 rounded-full bg-[#b8955a]/5">Deposit Confirmed</span>
            )}
            {order.status === 'transit' && (
              <span className="px-3 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200 rounded-full bg-emerald-50 flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-emerald-500" /> In Transit
              </span>
            )}
            {order.status === 'delivered' && (
              <span className="px-3 py-1 text-[10px] font-bold text-zinc-600 border border-zinc-200 rounded-full bg-zinc-50">✓ Completed & Handed Over</span>
            )}
          </div>

          {/* Middle Row: Vehicle Details */}
          <div className="flex gap-5 items-center">
            <div className="w-40 aspect-[16/10] shrink-0 rounded-lg overflow-hidden bg-zinc-100">
              <img src={order.vehicle.image} alt="Car" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-zinc-950">{order.vehicle.name}</h3>
              <p className="text-[11px] text-zinc-500">
                <span className="font-bold text-zinc-800">VIN:</span> {order.vehicle.vin} • <span className="font-bold text-zinc-800">Spec:</span> {order.vehicle.spec} • <span className="font-bold text-zinc-800">Qty:</span> {order.vehicle.qty}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-100" />

          {/* Bottom Row: Delivery Action */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11px] text-zinc-500 font-medium">
              {order.deliveryInfo.text}
            </p>
            {order.deliveryInfo.actionType === 'text-link' && (
              <button className="text-[10px] font-bold tracking-widest text-[#b8955a] hover:text-[#9d7d49] uppercase transition">
                {order.deliveryInfo.actionText}
              </button>
            )}
            {order.deliveryInfo.actionType === 'button' && (
              <button className="px-5 py-2 text-[10px] font-bold tracking-widest text-white bg-[#af8d55] hover:bg-[#9d7d49] rounded-lg uppercase transition">
                {order.deliveryInfo.actionText}
              </button>
            )}
          </div>

        </div>
      ))}
    </div>
  );
};