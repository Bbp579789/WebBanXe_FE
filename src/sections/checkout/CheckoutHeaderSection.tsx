import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export const CheckoutHeaderSection = () => (
  <>
    <div className="border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4">
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link to="/" className="hover:text-zinc-300 transition flex items-center gap-1">
            <Home className="size-3.5" /> Trang chủ
          </Link>
          <ChevronRight className="size-3 text-zinc-700" />
          <Link to="/vehicles" className="hover:text-zinc-300 transition">Dòng xe</Link>
          <ChevronRight className="size-3 text-zinc-700" />
          <span className="text-[#b8955a]">Đặt cọc</span>
        </nav>
      </div>
    </div>

    <div className="border-b border-zinc-800/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-14">
        <p className="text-[10px] font-mono text-[#b8955a] tracking-[0.3em] uppercase font-bold mb-3">
          Mercedes-Benz Online Deposit
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Đặt Cọc & Thanh Toán
        </h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-xl">
          Hoàn tất thủ tục đặt cọc trực tuyến để giữ xe độc quyền trong 14 ngày làm việc.
        </p>
      </div>
    </div>
  </>
);
