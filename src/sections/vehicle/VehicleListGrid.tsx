import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';
import { ProductCard } from '../../components/product/ProductCard';
import { LoginDialog } from '../../components/common/header/LoginDialog';
import { cartService } from '../../services/api/cartService';
import type { Vehicle } from '../../types';

interface VehicleListGridProps {
  itemsPerPage?: number;
}

export const VehicleListGrid: React.FC<VehicleListGridProps> = ({ itemsPerPage = 6 }) => {
  const { allVehicles = [], favorites = [], toggleFavorite, isLoading } = useVehicles();
  const safeVehicles = Array.isArray(allVehicles) ? allVehicles : [];

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('userName');
  });

  // State quản lý thông báo Toast
  const [toast, setToast] = useState<{ show: boolean; message: string; carName: string } | null>(null);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(localStorage.getItem('userName'));
    };

    window.addEventListener('authChange', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('authChange', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  // Tự động ẩn thông báo sau 3 giây
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const totalPages = Math.ceil(safeVehicles.length / itemsPerPage) || 1;

  const currentVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return safeVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [safeVehicles, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const listElement = document.getElementById('vehicle-grid-top');
      listElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Xử lý Thêm giỏ hàng + Hiện Toast Thông Báo
  const handleAddToCart = (car: Vehicle) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }

    cartService.addToCart(car, 1);

    // Bật thông báo Toast
    setToast({
      show: true,
      message: 'Đã thêm thành công vào giỏ hàng!',
      carName: `${car.brand || 'Mercedes-Benz'} ${car.model || ''}`,
    });
  };

  const handleDeposit = (car: Vehicle) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }

    cartService.addToCart(car, 1);
    
    setToast({
      show: true,
      message: 'Đã thêm xe vào cấu hình cọc thành công!',
      carName: `${car.brand || 'Mercedes-Benz'} ${car.model || ''}`,
    });
  };

  return (
    <section id="vehicle-grid-top" className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl py-14 select-none relative">
      
      {/* 1. KHU VỰC TIÊU ĐỀ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200/80 pb-6 mb-10 gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#b8955a] uppercase font-bold">
            VALOIR ATELIER COLLECTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mt-1.5 tracking-tight">
            Sản phẩm của chúng tôi
          </h2>
        </div>

        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          Hiển thị{' '}
          <span className="text-zinc-950 font-bold">
            {safeVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
            {Math.min(currentPage * itemsPerPage, safeVehicles.length)}
          </span>{' '}
          / {safeVehicles.length} cỗ máy
        </p>
      </div>

      {/* 2. LƯỚI THẺ SẢN PHẨM */}
      {isLoading ? (
        <div className="py-24 text-center font-mono text-xs text-zinc-400">
          Đang đồng bộ dữ liệu từ kho xe...
        </div>
      ) : currentVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentVehicles.map((car, index) => (
            <ProductCard
              key={car?.id ? `vehicle-${car.id}` : `vehicle-fallback-${index}`}
              car={car}
              isFavorite={favorites.includes(Number(car?.id))}
              onToggleFavorite={toggleFavorite}
              onAddToCart={handleAddToCart}
              onDeposit={handleDeposit}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-zinc-400 font-mono text-xs">
          Hiện chưa có sản phẩm nào trong kho lưu trữ.
        </div>
      )}

      {/* 3. PHÂN TRANG */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-14 flex items-center justify-center gap-2 select-none">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            aria-label="Trang trước"
          >
            <ChevronLeft className="size-4" />
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`flex size-10 items-center justify-center rounded-xl text-xs font-mono font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-md'
                    : 'border border-zinc-200 bg-white text-zinc-700 hover:border-[#b8955a] hover:text-[#b8955a]'
                }`}
              >
                {String(pageNum).padStart(2, '0')}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            aria-label="Trang sau"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

     {/* TOAST THÔNG BÁO Ở GÓC TRÊN CÙNG BÊN PHẢI */}
      {toast?.show && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-950/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl border border-zinc-800 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="size-9 rounded-full bg-[#b8955a]/20 text-[#b8955a] flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold font-sans text-white">{toast.message}</h4>
            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">{toast.carName}</p>
          </div>
        </div>
      )}

      {/* 5. MODAL ĐĂNG NHẬP */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(name) => {
          localStorage.setItem('userName', name);
          setCurrentUser(name);
          setIsLoginOpen(false);
          window.dispatchEvent(new Event('authChange'));
        }}
      />
    </section>
  );
};

export default VehicleListGrid;