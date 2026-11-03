// import React, { useState } from 'react';
// import { Compass, Disc } from 'lucide-react';
// import type { VehicleCardItem } from '../../types';
// import { ProductCard } from '../product/ProductCard';
// import { LoginDialog } from '../common/header/LoginDialog';
// import { MOCK_VEHICLES } from '../../data/vehicles.data';
// import { useVehicles } from '../../hooks/useVehicles';

// export const MaybachShowcase: React.FC = () => {
//   const [activeBrand, setActiveBrand] = useState<'mercedes' | 'amg' | 'maybach'>('maybach');
//   const [favorites, setFavorites] = useState<number[]>([]);
  

  // // Quản lý trạng thái tài khoản & Modal đăng nhập
  // const [isLoginOpen, setIsLoginOpen] = useState(false);
  // const [currentUser, setCurrentUser] = useState<string | null>(null);

  // const toggleFavorite = (id: number) => {
  //   setFavorites((prev) =>
  //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //   );
  // };

//   // 1. Logic Thêm vào giỏ hàng
//   const handleAddToCart = (car: VehicleCardItem) => {
//     if (!currentUser) {
//       setIsLoginOpen(true);
//       return;
//     }
//     alert(`Đã thêm xe ${car.model} vào giỏ hàng thành công!`);
//   };

//   // 2. Logic Đặt cọc
//   const handleDeposit = (car: VehicleCardItem) => {
//     if (!currentUser) {
//       setIsLoginOpen(true);
//       return;
//     }
//     alert(
//       `[HỢP ĐỒNG ĐẶT CỌC BẢO LƯU]\n- Khách hàng: ${currentUser}\n- Xe: ${car.model} (VIN: ${car.vin})\n- Giá xe: $${car.price.toLocaleString('en-US')}\n- Đặt cọc đợt 1: $${car.deposit_amount.toLocaleString('en-US')}`
//     );
//   };

//   return (
//     <>
//       <section className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pt-12">
//         {/* Brand Switcher */}
//         <div className="flex justify-center mb-14">
//           <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-zinc-200/90 shadow-xs">
//             <button
//               type="button"
//               onClick={() => setActiveBrand('mercedes')}
//               className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-xs font-mono tracking-wider cursor-pointer ${activeBrand === 'mercedes'
//                   ? 'bg-zinc-900 text-white shadow-sm'
//                   : 'text-zinc-500 hover:text-zinc-900'
//                 }`}
//             >
//               <Compass className="size-3.5" />
//               <span>MERCEDES-BENZ</span>
//             </button>

//             <button
//               type="button"
//               onClick={() => setActiveBrand('amg')}
//               className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-xs font-mono tracking-wider cursor-pointer ${activeBrand === 'amg'
//                   ? 'bg-zinc-900 text-white shadow-sm'
//                   : 'text-zinc-500 hover:text-zinc-900'
//                 }`}
//             >
//               <Disc className="size-3.5" />
//               <span>MERCEDES-AMG</span>
//             </button>

//             <button
//               type="button"
//               onClick={() => setActiveBrand('maybach')}
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-xs font-mono font-semibold tracking-wider cursor-pointer ${activeBrand === 'maybach'
//                   ? 'bg-[#b8955a] text-black shadow-sm'
//                   : 'text-zinc-500 hover:text-zinc-900'
//                 }`}
//             >
//               <span>MAYBACH</span>
//             </button>
//           </div>
//         </div>

//         {/* Tiêu đề giới thiệu */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//           <div className="max-w-2xl">
//             <span className="text-[11px] font-mono tracking-[0.25em] text-[#b8955a] uppercase font-bold">
//               VALOIR MAYBACH SANCTUARY
//             </span>
//             <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-bold text-zinc-950 mt-2 tracking-tight leading-[1.18]">
//               Kiệt Tác Xe Siêu Sang Mercedes-Maybach
//             </h1>
//           </div>
//           <p className="max-w-md text-xs leading-relaxed text-zinc-600 font-sans">
//             Mỗi cỗ máy Maybach là một bảo chứng của vị thế thượng tôn, được trang bị phòng khánh tiết phía sau tách biệt và lớp hoàn thiện thủ công Manufaktur hoàn mỹ.
//           </p>
//         </div>

//         {/* Danh sách thẻ xe */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {MAYBACH_PRODUCTS.map((car) => (
//             <ProductCard
//               key={car.id}
//               car={car}
//               isFavorite={favorites.includes(car.id)}
//               onToggleFavorite={toggleFavorite}
//               onAddToCart={handleAddToCart}
//               onDeposit={handleDeposit}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Popup Đăng nhập khi người dùng thao tác mà chưa đăng nhập */}
      // <LoginDialog
      //   isOpen={isLoginOpen}
      //   onClose={() => setIsLoginOpen(false)}
      //   onLoginSuccess={(name) => {
      //     setCurrentUser(name);
      //     setIsLoginOpen(false);
      //   }}
      // />
//     </>
//   );
// };

// export default MaybachShowcase;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "../../types";
import { ProductCard } from "../../components/product/ProductCard";
import { LoginDialog } from "../../components/common/header/LoginDialog";
import { getVehicles } from "../../services/api/vehicleService";
import { cartService } from "../../services/api/cartService";

export const MaybachShowcase: React.FC = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(
    () => localStorage.getItem("userName")
  );

  // Lấy 3 xe đầu tiên từ backend, không lọc theo thương hiệu
  useEffect(() => {
    let active = true;

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const allCars = await getVehicles();
        console.log("Xe từ database:", allCars);
console.log("Thông tin xe đầu tiên:", allCars[0]);

        console.log("Danh sách xe từ API:", allCars);
        console.log("Dữ liệu có phải mảng không:", Array.isArray(allCars));

        if (!Array.isArray(allCars)) {
          throw new Error("Dữ liệu API không phải danh sách xe");
        }

        if (active) {
          setVehicles(allCars.slice(0, 3));
        }
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

  // Bật/tắt yêu thích
  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((favoriteId) => favoriteId !== id)
        : [...prev, id]
    );
  };

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

  // Thêm xe vào giỏ hàng rồi chuyển sang thanh toán
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

  // Cập nhật trạng thái sau khi đăng nhập
  const handleLoginSuccess = (name: string) => {
    localStorage.setItem("userName", name);
    setCurrentUser(name);
    setIsLoginOpen(false);

    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <>
      <section className="container mx-auto max-w-7xl px-6 pt-12 sm:px-10 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#b8955a]">
              VALOIR PREMIUM COLLECTION
            </span>

            <h1 className="mt-2 font-serif text-3xl font-bold leading-[1.18] tracking-tight text-zinc-950 sm:text-4xl lg:text-[44px]">
              Bộ Sưu Tập Xe Cao Cấp
            </h1>
          </div>

          <p className="max-w-md font-sans text-xs leading-relaxed text-zinc-600">
            Khám phá những mẫu xe nổi bật trong hệ thống của chúng tôi,
            với thông tin được tải trực tiếp từ dữ liệu backend.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-xs text-zinc-400">
            Đang tải dữ liệu xe...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-sm text-red-500">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-100"
            >
              Thử lại
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex items-center justify-center rounded-3xl border border-dashed border-zinc-200/60 bg-zinc-50 py-20 font-mono text-xs text-zinc-400">
            Backend chưa có dữ liệu xe.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((car, index) => (
              <ProductCard
                key={car.id ?? `showcase-fallback-${index}`}
                car={car}
                isFavorite={favorites.includes(Number(car.id))}
                onToggleFavorite={toggleFavorite}
                onAddToCart={handleAddToCart}
                onDeposit={handleDeposit}
              />
            ))}
          </div>
        )}
      </section>

      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default MaybachShowcase;