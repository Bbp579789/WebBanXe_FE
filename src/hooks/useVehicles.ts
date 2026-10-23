// import { useState, useMemo } from 'react';
// import { MOCK_VEHICLES } from '../data/vehicles.data';
// import type { VehicleCardItem } from '../types/index';

// export type BrandType = 'mercedes' | 'amg' | 'maybach';

// export function useVehicles(initialBrand: BrandType = 'maybach') {
//   const [vehicles] = useState<VehicleCardItem[]>(MOCK_VEHICLES);
//   const [activeBrand, setActiveBrand] = useState<BrandType>(initialBrand);
//   const [favorites, setFavorites] = useState<number[]>([]);

//   const filteredVehicles = useMemo(() => {
//     return vehicles.filter((v) => {
//       const brandLower = v.brand.toLowerCase();
//       const modelLower = v.model.toLowerCase();

//       if (activeBrand === 'maybach') {
//         return brandLower.includes('maybach');
//       }

//       if (activeBrand === 'amg') {
//         return brandLower.includes('amg') || modelLower.includes('amg');
//       }

//       // Tab 'mercedes': Lọc xe Mercedes-Benz tiêu chuẩn, loại bỏ cả Maybach và AMG
//       const isMaybach = brandLower.includes('maybach');
//       const isAmg = brandLower.includes('amg') || modelLower.includes('amg');
//       return !isMaybach && !isAmg;
//     });
//   }, [vehicles, activeBrand]);

//   const toggleFavorite = (id: number) => {
//     setFavorites((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   return {
//     vehicles: filteredVehicles, // Danh sách xe đã qua bộ lọc (dùng cho Showcase)
//     allVehicles: vehicles,       // Danh sách toàn bộ xe không lọc (dùng cho VehiclesPage)
//     activeBrand,
//     setActiveBrand,
//     favorites,
//     toggleFavorite,
//   };
// }

import { useState, useEffect, useMemo } from 'react';
import { vehicleService } from '../services/api/vehicleService';
import type { VehicleCardItem } from '../types';

export function useVehicles(initialBrand: 'mercedes' | 'amg' | 'maybach' = 'maybach') {
  const [vehicles, setVehicles] = useState<VehicleCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState(initialBrand);
  const [favorites, setFavorites] = useState<number[]>([]);

 useEffect(() => {
  let isMounted = true;
  setIsLoading(true);

  vehicleService
    .getAllVehicles()
    .then((data: any) => {
      if (isMounted) {
        const rawList = Array.isArray(data) ? data : data?.data || [];
        
        // TỰ ĐỘNG GÁN ID (1, 2, 3...) NẾU BACKEND KHÔNG TRẢ VỀ CỘT ID
        const normalizedList = rawList.map((item: any, index: number) => ({
          ...item,
          id: item.id ?? item._id ?? item.vehicle_id ?? index + 1,
        }));

        setVehicles(normalizedList);
      }
    })
    .catch((err) => {
      console.error('Lỗi khi tải dữ liệu xe từ Backend:', err);
    })
    .finally(() => {
      if (isMounted) setIsLoading(false);
    });

  return () => {
    isMounted = false;
  };
}, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const brandLower = (v.brand || '').toLowerCase();
      if (activeBrand === 'maybach') return brandLower.includes('maybach');
      if (activeBrand === 'amg') return brandLower.includes('amg');
      return !brandLower.includes('maybach') && !brandLower.includes('amg');
    });
  }, [vehicles, activeBrand]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return {
    vehicles: filteredVehicles,
    allVehicles: vehicles,
    isLoading,
    activeBrand,
    setActiveBrand,
    favorites,
    toggleFavorite,
  };
}