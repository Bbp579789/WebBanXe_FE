import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useVehicles } from './useVehicles';
import type { Vehicle } from '../types';
import { cartService } from '../services/api/cartService';

export function useVehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { allVehicles = [] } = useVehicles();

  // Quản lý trạng thái đăng nhập
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem('userName')
  );

  useEffect(() => {
    const syncAuth = () => setCurrentUser(localStorage.getItem('userName'));
    window.addEventListener('authChange', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('authChange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  // 1. Lấy dữ liệu xe truyền từ Card qua state hoặc tìm trong danh sách
  const vehicleFromState = (location.state as { vehicle?: Vehicle })?.vehicle;

  const selectedVehicle =
    vehicleFromState ||
    allVehicles.find(
      (v) =>
        String(v.id) === String(id) ||
        v.vin === id ||
        `${v.brand}-${v.model}`.toLowerCase().replace(/\s+/g, '-') === id
    ) ||
    allVehicles[0];

  // 2. Xử lý Đặt cọc / Thêm vào giỏ hàng
  const handleAddToCart = (item: Vehicle, qty: number) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    // 1. Thêm vào giỏ hàng lưu trữ
  cartService.addToCart(item, qty);

  // 2. Thông báo thành công
  alert(`Đã thêm ${qty} xe ${item?.brand || ''} ${item?.model || ''} vào giỏ hàng thành công!`);
  };

  // 3. Xử lý Đăng ký lái thử
  const handleBookTestDrive = (item: Vehicle) => {
    navigate('/test-drive', { state: { vehicle: item } });
  };

  // 4. Đồng bộ khi đăng nhập thành công
  const handleLoginSuccess = (name: string) => {
    localStorage.setItem('userName', name);
    setCurrentUser(name);
    setIsLoginOpen(false);
    window.dispatchEvent(new Event('authChange'));
  };

  const closeLogin = () => setIsLoginOpen(false);

  return {
    vehicle: selectedVehicle,
    isLoginOpen,
    closeLogin,
    handleAddToCart,
    handleBookTestDrive,
    handleLoginSuccess,
  };
}