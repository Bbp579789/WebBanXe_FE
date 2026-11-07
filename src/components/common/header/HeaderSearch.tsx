
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, CarFront } from 'lucide-react';

import { Input } from '../../ui/input';
import { useClickOutside } from '../../../hooks/useClickOutside';

import type { HeaderSearchProps } from '../../../types/header.types';
import type { Vehicle } from '../../../types';

import { getVehicles } from '../../../services/api/user/vehicleService';

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  isSolid,
  onSearch,
}) => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [suggestions, setSuggestions] = useState<Vehicle[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Đóng gợi ý khi click bên ngoài
  useClickOutside(containerRef, () => {
    setShowSuggestions(false);
  });

  // ==========================================
  // 1. LẤY DANH SÁCH XE TỪ API
  // ==========================================
  useEffect(() => {
  let isMounted = true;

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      // Lấy trang đầu tiên
      const firstResponse = await getVehicles({
        page: 1,
        limit: 10,
      });

      let allVehicles = [...firstResponse.data];

      // Lấy các trang còn lại
      const totalPages = firstResponse.pagination.totalPages;

      for (let page = 2; page <= totalPages; page++) {
        const response = await getVehicles({
          page,
          limit: 10,
        });

        allVehicles = [...allVehicles, ...response.data];
      }

      if (isMounted) {
        setVehicles(allVehicles);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách xe:', error);

      if (isMounted) {
        setVehicles([]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchVehicles();

  return () => {
    isMounted = false;
  };
}, []);
  // ==========================================
  // 2. CHUẨN HÓA TỪ KHÓA
  // ==========================================
  const normalizeText = (value: string): string => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // ==========================================
  // 3. LẤY TÊN ĐẦY ĐỦ CỦA XE
  // ==========================================
  const getVehicleName = (vehicle: Vehicle): string => {
    return [
      vehicle.brand,
      vehicle.model,
      vehicle.variant,
      vehicle.year,
    ]
      .filter(Boolean)
      .join(' ');
  };

  // ==========================================
  // 4. TÌM KIẾM XE
  // ==========================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setKeyword(value);

    const searchKeyword = normalizeText(value);

    if (searchKeyword.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const results = vehicles.filter((vehicle) => {
      const searchableText = normalizeText(
        [
          vehicle.brand,
          vehicle.model,
          vehicle.variant,
          vehicle.year?.toString(),
        ]
          .filter(Boolean)
          .join(' ')
      );

      return searchableText.includes(searchKeyword);
    });

    setSuggestions(results.slice(0, 6));
    setShowSuggestions(true);
  };

  // ==========================================
  // 5. CHỌN XE -> TRANG CHI TIẾT
  // ==========================================
  const handleSelect = (vehicle: Vehicle) => {
    const vehicleName = getVehicleName(vehicle);

    setKeyword(vehicleName);
    setShowSuggestions(false);
    setSuggestions([]);

    // ĐÚNG VỚI ROUTER CỦA BẠN
    navigate(`/vehicle-detail/${vehicle.id}`);
  };

  // ==========================================
  // 6. NHẤN ENTER ĐỂ TÌM KIẾM
  // ==========================================
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const value = keyword.trim();

    if (!value) {
      setShowSuggestions(false);
      return;
    }

    const searchKeyword = normalizeText(value);

    // Nếu khớp chính xác tên xe thì chuyển trang chi tiết
    const matchedVehicle = vehicles.find((vehicle) => {
      return normalizeText(getVehicleName(vehicle)) === searchKeyword;
    });

    setShowSuggestions(false);

    if (matchedVehicle) {
      navigate(`/vehicle-detail/${matchedVehicle.id}`);
      return;
    }

    // Nếu không khớp chính xác thì gửi từ khóa cho component cha
    onSearch?.(value);
  };

  // ==========================================
  // 7. GIAO DIỆN
  // ==========================================
  return (
    <div ref={containerRef} className="relative w-full">

      <form
        onSubmit={handleSubmit}
        className="relative w-full"
      >
        <Input
          value={keyword}
          onChange={handleChange}
          placeholder="Tìm Mercedes, Maybach, AMG..."
          autoComplete="off"
          className={
            isSolid
              ? 'bg-transparent border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus-visible:border-[#b8955a] focus-visible:ring-1 focus-visible:ring-[#b8955a] pr-10'
              : 'bg-transparent border-white/30 text-white placeholder:text-zinc-300 focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white/50 pr-10'
          }
        />

        <button
          type="submit"
          aria-label="Tìm kiếm"
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
            isSolid
              ? 'text-zinc-600 hover:text-[#b8955a]'
              : 'text-zinc-200 hover:text-white'
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </button>
      </form>

      {/* DANH SÁCH GỢI Ý */}
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-[#17171a] border border-[#2d2d32] shadow-2xl py-2 z-50 overflow-hidden">

          {suggestions.length > 0 ? (
            <>
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-500">
                Xe Mercedes-Benz phù hợp
              </div>

              {suggestions.map((vehicle) => (
                <button
                  type="button"
                  key={vehicle.id}
                  onClick={() => handleSelect(vehicle)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#25252b] transition-colors group"
                >
                  {/* ẢNH XE */}
                  {vehicle.image_url ? (
                    <img
                      src={vehicle.image_url}
                      alt={getVehicleName(vehicle)}
                      className="w-16 h-11 object-cover rounded-md bg-[#25252b]"
                    />
                  ) : (
                    <div className="w-16 h-11 flex items-center justify-center bg-[#25252b] rounded-md">
                      <CarFront className="w-5 h-5 text-[#b8955a]" />
                    </div>
                  )}

                  {/* THÔNG TIN XE */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium group-hover:text-[#b8955a] transition-colors truncate">
                      {getVehicleName(vehicle)}
                    </p>

                    <p className="text-[10px] text-zinc-500 mt-1">
                      {vehicle.brand} · {vehicle.year}
                    </p>

                    <p className="text-[10px] text-[#b8955a] mt-1">
                      {Number(vehicle.price).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>

                  <Search className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#b8955a] shrink-0" />
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-4 text-xs text-zinc-400 text-center">
              {loading
                ? 'Đang tải danh sách xe...'
                : 'Không tìm thấy xe phù hợp.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
