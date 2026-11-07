import { Car, ShieldCheck } from "lucide-react";
import type { Vehicle } from "../../types";
import { formatCurrency } from "../../utils/checkout";

interface Props {
  vehicle: Vehicle;
}

export const VehicleInfoSection = ({ vehicle }: Props) => {
  const fullName = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
  const price = Number(vehicle.price) || 0;

  return (
    <section className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-mono font-bold text-zinc-300 rounded">01</span>
        <span className="text-[11px] font-mono text-[#b8955a] font-bold uppercase tracking-widest">Thông tin xe</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="shrink-0 w-full sm:w-56 h-40 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/50">
          {vehicle.image_url ? (
            <img src={vehicle.image_url} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Car className="size-16 text-zinc-600" /></div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-serif font-bold text-white">{fullName}</h3>
          <div className="space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between border-b border-zinc-800 pb-2"><span>VIN</span><span className="font-mono text-zinc-300">{vehicle.vin || "—"}</span></div>
            <div className="flex justify-between border-b border-zinc-800 pb-2"><span>Ngoại thất</span><span className="text-zinc-300">{vehicle.exterior_color || "—"}</span></div>
            <div className="flex justify-between border-b border-zinc-800 pb-2"><span>Nội thất</span><span className="text-zinc-300">{vehicle.interior_color || "—"}</span></div>
            <div className="flex justify-between"><span>Giá niêm yết</span><span className="font-mono font-bold text-[#b8955a]">{formatCurrency(price)}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 border border-emerald-800/50 bg-emerald-950/30 rounded-xl flex items-center gap-3 text-xs text-emerald-400">
        <ShieldCheck className="size-4 shrink-0" />
        <span>Số VIN sẽ được khóa độc quyền cho bạn sau khi hoàn tất đặt cọc.</span>
      </div>
    </section>
  );
};
