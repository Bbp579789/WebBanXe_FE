
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "../../types";
import { ProductCard } from "../../components/product/ProductCard";
import { LoginDialog } from "../../components/common/header/LoginDialog";
import { getVehicles } from "../../services/api/user/vehicleService";
import { cartService } from "../../services/api/user/cartService";

export const MaybachShowcase: React.FC = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [favorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(
    () => localStorage.getItem("userName")
  );

  useEffect(() => {
    let active = true;

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        // Lấy trang 1
        const firstResponse = await getVehicles({
          page: 1,
          limit: 10,
        });

        let allCars = [...firstResponse.data];

        // Lấy các trang còn lại
        for (
          let page = 2;
          page <= firstResponse.pagination.totalPages;
          page++
        ) {
          const response = await getVehicles({
            page,
            limit: 10,
          });

          allCars = [...allCars, ...response.data];
        }

        console.log("Tổng số xe từ API:", allCars.length);
        console.log("Danh sách xe:", allCars);

        if (!active) return;

        // Hiển thị 3 xe nổi bật đầu tiên
        setVehicles(allCars.slice(0, 3));
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu xe:", err);

        if (active) {
          setError("Không thể tải dữ liệu xe. Vui lòng thử lại.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchVehicles();

    const syncAuth = () => {
      setCurrentUser(localStorage.getItem("userName"));
    };

    window.addEventListener("authChange", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      active = false;
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // Thêm xe vào giỏ hàng
  const handleAddToCart = async (car: Vehicle) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }

    try {
      await cartService.addToCart(
        Number(car.id),
        1,
        Number(car.price)
      );

      window.dispatchEvent(new Event("cartChange"));

      alert(`Đã thêm ${car.brand} ${car.model} vào giỏ hàng!`);
    } catch (err) {
      console.error("Lỗi thêm xe vào giỏ hàng:", err);
      alert("Xe này đã có trong giỏ hàng.");
    }
  };

  // Thêm xe vào giỏ hàng và chuyển sang thanh toán
  const handleDeposit = async (car: Vehicle) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }

    try {
      await cartService.addToCart(
        Number(car.id),
        1,
        Number(car.price)
      );

      window.dispatchEvent(new Event("cartChange"));
      navigate("/payment");
    } catch (err) {
      console.error("Lỗi khi đặt cọc xe:", err);
      alert("Không thể tiếp tục đặt cọc. Vui lòng thử lại.");
    }
  };

  // Đồng bộ trạng thái đăng nhập
  const handleLoginSuccess = (name: string) => {
    localStorage.setItem("userName", name);
    setCurrentUser(name);
    setIsLoginOpen(false);

    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-5 pt-14 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">

        {/* HEADER */}
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b8955a] sm:text-xs">
              MERCEDES PREMIUM COLLECTION
            </span>

            <h2 className="mt-3 font-['Be_Vietnam_Pro'] text-3xl font-medium leading-[1.4] tracking-[-0.035em] text-[#1A1A1A] sm:text-4xl lg:text-[42px]">
              Những Cổ Máy Nổi Bật
            </h2>
          </div>

          <p className="max-w-md font-sans text-sm font-normal leading-7 tracking-normal text-zinc-600">
            Khám phá những mẫu xe nổi bật trong hệ thống của chúng tôi,
            nơi hội tụ thiết kế tinh tế, công nghệ tiên tiến và trải nghiệm
            vận hành đẳng cấp.
          </p>
        </div>

        {/* VEHICLE LIST */}
        {loading ? (
          <div className="flex items-center justify-center py-20 font-sans text-sm text-zinc-400">
            Đang tải dữ liệu xe...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 font-sans text-sm text-red-500">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg border border-zinc-300 px-5 py-2.5 font-sans text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              Thử lại
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 py-20 font-sans text-sm text-zinc-400">
            Backend chưa có dữ liệu xe.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {vehicles.map((car, index) => (
              <ProductCard
                key={car.id ?? `showcase-fallback-${index}`}
                car={car}
                isFavorite={favorites.includes(Number(car.id))}
                onAddToCart={handleAddToCart}
                onDeposit={handleDeposit}
              />
            ))}
          </div>
        )}
      </section>

      {/* LOGIN DIALOG */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default MaybachShowcase;
