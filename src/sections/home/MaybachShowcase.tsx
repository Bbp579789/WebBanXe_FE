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



import React, { useState } from 'react';
import { Compass, Disc } from 'lucide-react';
import type { VehicleCardItem } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';
import { LoginDialog } from '../../components/common/header/LoginDialog';
import { useVehicles } from '../../hooks/useVehicles';

export const MaybachShowcase: React.FC = () => {
  // Sử dụng trực tiếp logic filter và favorites từ custom hook
  const { vehicles, activeBrand, setActiveBrand, favorites, toggleFavorite } = useVehicles('maybach');

  // Quản lý trạng thái tài khoản & Modal đăng nhập
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // 1. Logic Thêm vào giỏ hàng
  const handleAddToCart = (car: VehicleCardItem) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    alert(`Đã thêm xe ${car.model} vào giỏ hàng thành công!`);
  };

  // 2. Logic Đặt cọc
  const handleDeposit = (car: VehicleCardItem) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    alert(
      `[HỢP ĐỒNG ĐẶT CỌC BẢO LƯU]\n- Khách hàng: ${currentUser}\n- Xe: ${car.model} (VIN: ${car.vin})\n- Giá xe: $${car.price.toLocaleString('en-US')}\n- Đặt cọc đợt 1: $${car.deposit_amount.toLocaleString('en-US')}`
    );
  };

  return (
    <>
      <section className="container mx-auto px-6 sm:px-10 lg:px-12 max-w-7xl pt-12">
        {/* Brand Switcher */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-zinc-200/90 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveBrand('mercedes')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-xs font-mono tracking-wider cursor-pointer ${
                activeBrand === 'mercedes'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Compass className="size-3.5" />
              <span>MERCEDES-BENZ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBrand('amg')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-xs font-mono tracking-wider cursor-pointer ${
                activeBrand === 'amg'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Disc className="size-3.5" />
              <span>MERCEDES-AMG</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveBrand('maybach')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-xs font-mono font-semibold tracking-wider cursor-pointer ${
                activeBrand === 'maybach'
                  ? 'bg-[#b8955a] text-black shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span>MAYBACH</span>
            </button>
          </div>
        </div>

        {/* Tiêu đề giới thiệu */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#b8955a] uppercase font-bold">
              VALOIR MAYBACH SANCTUARY
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-bold text-zinc-950 mt-2 tracking-tight leading-[1.18]">
              Kiệt Tác Xe Siêu Sang Mercedes-Maybach
            </h1>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-zinc-600 font-sans">
            Mỗi cỗ máy Maybach là một bảo chứng của vị thế thượng tôn, được trang bị phòng khánh tiết phía sau tách biệt và lớp hoàn thiện thủ công Manufaktur hoàn mỹ.
          </p>
        </div>

        {/* Danh sách thẻ xe (sử dụng mảng vehicles đã lọc từ useVehicles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((car) => (
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
      </section>

      {/* Popup Đăng nhập khi người dùng thao tác mà chưa đăng nhập */}
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
    </>
  );
};

export default MaybachShowcase;