import { useState, useMemo } from 'react';
import { MOCK_VEHICLES } from '../data/vehicles.data';
import type { VehicleCardItem } from '../types/index';

export type BrandType = 'mercedes' | 'amg' | 'maybach';

export function useVehicles(initialBrand: BrandType = 'maybach') {
  const [vehicles] = useState<VehicleCardItem[]>(MOCK_VEHICLES);
  const [activeBrand, setActiveBrand] = useState<BrandType>(initialBrand);
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const brandLower = v.brand.toLowerCase();
      const modelLower = v.model.toLowerCase();

      if (activeBrand === 'maybach') {
        return brandLower.includes('maybach');
      }

      if (activeBrand === 'amg') {
        return brandLower.includes('amg') || modelLower.includes('amg');
      }

      // Tab 'mercedes': Lọc xe Mercedes-Benz tiêu chuẩn, loại bỏ cả Maybach và AMG
      const isMaybach = brandLower.includes('maybach');
      const isAmg = brandLower.includes('amg') || modelLower.includes('amg');
      return !isMaybach && !isAmg;
    });
  }, [vehicles, activeBrand]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return {
    vehicles: filteredVehicles, // Danh sách xe đã qua bộ lọc (dùng cho Showcase)
    allVehicles: vehicles,       // Danh sách toàn bộ xe không lọc (dùng cho VehiclesPage)
    activeBrand,
    setActiveBrand,
    favorites,
    toggleFavorite,
  };
}