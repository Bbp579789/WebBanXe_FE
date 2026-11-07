import { useState, useEffect, useMemo } from 'react';
import { getVehicles } from '../services/api/user/vehicleService';
import type { VehicleCardItem } from '../types';

export function useVehicles(
  initialBrand: 'mercedes' | 'amg' | 'maybach' = 'maybach'
) {
  const [vehicles, setVehicles] = useState<VehicleCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState(initialBrand);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchAllVehicles = async () => {
      setIsLoading(true);

      try {
        // Lấy trang đầu tiên
        const firstResponse = await getVehicles({
          page: 1,
          limit: 10,
        });

        let rawList = [...firstResponse.data];

        // Lấy thông tin tổng số trang
        const totalPages = firstResponse.pagination.totalPages;

        // Lấy các trang tiếp theo
        for (let page = 2; page <= totalPages; page++) {
          const response = await getVehicles({
            page,
            limit: 10,
          });

          rawList = [...rawList, ...response.data];
        }

        // Chuẩn hóa dữ liệu
        const normalizedList = rawList.map((item, index) => ({
          ...item,
          id: item.id ?? index + 1,
        }));

        if (isMounted) {
          setVehicles(normalizedList);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu xe từ Backend:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lọc thương hiệu
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const brandLower = (v.brand || '').toLowerCase();

      if (activeBrand === 'maybach') {
        return brandLower.includes('maybach');
      }

      if (activeBrand === 'amg') {
        return brandLower.includes('amg');
      }

      return (
        !brandLower.includes('maybach') &&
        !brandLower.includes('amg')
      );
    });
  }, [vehicles, activeBrand]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
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
