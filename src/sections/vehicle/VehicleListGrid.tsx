
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';
import { useVehicleDetail } from '../../hooks/useVehicleDetail';
import { ProductCard } from '../../components/product/ProductCard';
import { LoginDialog } from '../../components/common/header/LoginDialog';
import type { Vehicle } from '../../types';

interface VehicleListGridProps {
  itemsPerPage?: number;
}

export const VehicleListGrid: React.FC<VehicleListGridProps> = ({
  itemsPerPage = 6,
}) => {
  const {
    allVehicles = [],
    favorites = [],
    toggleFavorite,
    isLoading,
  } = useVehicles();

  const {
    isLoginOpen,
    closeLogin,
    handleAddToCart: addVehicleToCart,
    handleLoginSuccess,
    cartLoading,
  } = useVehicleDetail();

  const navigate = useNavigate();

  const safeVehicles = Array.isArray(allVehicles) ? allVehicles : [];

  const [currentPage, setCurrentPage] = useState(1);

  // Đồng bộ trạng thái đăng nhập cho component
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem('userName')
  );

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

  const totalPages = Math.ceil(safeVehicles.length / itemsPerPage) || 1;

  const currentVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return safeVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [safeVehicles, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      document
        .getElementById('vehicle-grid-top')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nút thêm vào giỏ hàng
  const handleAddToCart = async (car: Vehicle) => {
    if (!currentUser) {
      // Mở popup đăng nhập
      // Việc mở popup được xử lý bởi hook useVehicleDetail
      // thông qua handleAddToCart khi chưa đăng nhập.
      await addVehicleToCart(car, 1);
      return;
    }

    await addVehicleToCart(car, 1);
  };

  // Nút đặt cọc
  const handleDeposit = async (car: Vehicle) => {
    if (!currentUser) {
      await addVehicleToCart(car, 1);
      return;
    }

    const success = await addVehicleToCart(car, 1);

    if (success) {
      navigate('/payment', {
        state: {
          vehicle: car,
          quantity: 1,
          depositAmount: 100000000,
        },
      });
    }
  };

  return (
    <section
      id="vehicle-grid-top"
      className="container mx-auto max-w-7xl select-none relative px-6 py-14 sm:px-10 lg:px-12"
    >
      {/* Tiêu đề */}
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-200/80 pb-6 md:flex-row md:items-end">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#b8955a]">
            VALOIR ATELIER COLLECTION
          </span>

          <h2 className="mt-1.5 text-3xl font-serif font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Sản phẩm của chúng tôi
          </h2>
        </div>

        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
          Hiển thị{' '}
          <span className="font-bold text-zinc-950">
            {safeVehicles.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{' '}
            - {Math.min(currentPage * itemsPerPage, safeVehicles.length)}
          </span>{' '}
          / {safeVehicles.length} cỗ máy
        </p>
      </div>

      {/* Danh sách xe */}
      {isLoading ? (
        <div className="py-24 text-center font-mono text-xs text-zinc-400">
          Đang đồng bộ dữ liệu từ kho xe...
        </div>
      ) : currentVehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentVehicles.map((car, index) => (
            <ProductCard
              key={
                car?.id
                  ? `vehicle-${car.id}`
                  : `vehicle-fallback-${index}`
              }
              car={car}
              isFavorite={favorites.includes(Number(car?.id))}
              onToggleFavorite={toggleFavorite}
              onAddToCart={handleAddToCart}
              onDeposit={handleDeposit}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center font-mono text-xs text-zinc-400">
          Hiện chưa có sản phẩm nào trong kho lưu trữ.
        </div>
      )}

      {/* Phân trang */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-14 flex select-none items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:border-[#b8955a] hover:text-[#b8955a] disabled:pointer-events-none disabled:opacity-30"
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
                className={`flex size-10 cursor-pointer items-center justify-center rounded-xl text-xs font-mono font-medium transition ${
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
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:border-[#b8955a] hover:text-[#b8955a] disabled:pointer-events-none disabled:opacity-30"
            aria-label="Trang sau"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

      {/* Popup đăng nhập */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onLoginSuccess={handleLoginSuccess}
      />
    </section>
  );
};

export default VehicleListGrid;
