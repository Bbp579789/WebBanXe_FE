import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';
import { ProductCard } from '../../components/product/ProductCard';
import { LoginDialog } from '../../components/common/header/LoginDialog';
import type { VehicleCardItem } from '../../types';

interface VehicleListGridProps {
  itemsPerPage?: number; // Số lượng xe trên 1 trang (mặc định 6 xe)
}

export const VehicleListGrid: React.FC<VehicleListGridProps> = ({ itemsPerPage = 6 }) => {
  // Lấy toàn bộ xe từ hook
  const { allVehicles, favorites, toggleFavorite } = useVehicles();

  // State quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State đăng nhập
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(allVehicles.length / itemsPerPage) || 1;

  // Cắt danh sách xe hiển thị cho trang hiện tại
  const currentVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [allVehicles, currentPage, itemsPerPage]);

  // Đổi trang và cuộn nhẹ lên đầu danh sách sản phẩm
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const listElement = document.getElementById('vehicle-grid-top');
      listElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (car: VehicleCardItem) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    alert(`Đã thêm xe ${car.brand} ${car.model} vào giỏ hàng thành công!`);
  };

  const handleDeposit = (car: VehicleCardItem) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    alert(`Tiến hành làm hợp đồng bảo lưu & đặt cọc xe: ${car.model} (VIN: ${car.vin})`);
  };

  return (
    <section id="vehicle-grid-top" className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl py-14">
      {/* 1. KHU VỰC TIÊU ĐỀ "SẢN PHẨM CỦA CHÚNG TÔI" */}
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
            {allVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
            {Math.min(currentPage * itemsPerPage, allVehicles.length)}
          </span>{' '}
          / {allVehicles.length} cỗ máy
        </p>
      </div>

      {/* 2. LƯỚI THẺ SẢN PHẨM */}
      {currentVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentVehicles.map((car) => (
            <ProductCard
              key={car.id}
              car={car}
              isFavorite={favorites.includes(car.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={handleAddToCart}
              onDeposit={handleDeposit}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-400 font-mono text-sm">
          Hiện chưa có sản phẩm nào trong kho lưu trữ.
        </div>
      )}

      {/* 3. THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
      {totalPages > 1 && (
        <div className="mt-14 flex items-center justify-center gap-2 select-none">
          {/* Nút Prev */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:border-[#b8955a] hover:text-[#b8955a] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            aria-label="Trang trước"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Danh sách các số trang */}
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

          {/* Nút Next */}
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

      {/* Popup Đăng nhập */}
    <LoginDialog
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={(name) => {
              setCurrentUser(name);
              setIsLoginOpen(false);
              localStorage.setItem('userName', name);
        window.dispatchEvent(new Event('authChange'));
            }}
          />
    </section>
  );
};

export default VehicleListGrid;