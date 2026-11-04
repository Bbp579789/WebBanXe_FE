import { Car, Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

export const CheckoutLoading = ({ message = "ĐANG TẢI THÔNG TIN XE..." }: LoadingProps) => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="size-10 text-[#b8955a] animate-spin mx-auto mb-4" />
      <p className="text-sm text-zinc-400 font-mono tracking-wide">{message}</p>
    </div>
  </div>
);

interface ErrorProps {
  message: string;
  onBack: () => void;
}

export const CheckoutError = ({ message, onBack }: ErrorProps) => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
    <div className="text-center max-w-md">
      <Car className="size-16 text-zinc-700 mx-auto mb-6" />
      <h2 className="text-2xl font-serif font-bold text-white mb-3">Không tìm thấy xe</h2>
      <p className="text-sm text-zinc-400 mb-8">{message}</p>
      <button onClick={onBack} className="px-8 py-3 bg-[#b8955a] text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#a3834c] transition">
        Xem Danh Sách Xe
      </button>
    </div>
  </div>
);

export const CheckoutProcessingOverlay = ({ message }: LoadingProps) => (
  <div className="fixed inset-0 z-[9999] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center">
    <div className="text-center max-w-sm px-6">
      <div className="relative mx-auto mb-8 size-20">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-[#b8955a] border-t-transparent animate-spin" />
      </div>
      <h3 className="text-xl font-serif font-bold text-white mb-2">Đang xử lý</h3>
      <p className="text-sm text-zinc-400 font-mono">{message}</p>
      <p className="text-[10px] text-zinc-600 mt-4 font-mono uppercase tracking-widest">
        Vui lòng không đóng trình duyệt
      </p>
    </div>
  </div>
);
