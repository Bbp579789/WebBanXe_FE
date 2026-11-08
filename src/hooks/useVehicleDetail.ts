
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useVehicles } from './useVehicles';
import type { Vehicle } from '../types';
import { cartService, getCartErrorMessage, isVehicleAlreadyInCart } from '../services/api/user/cartService';

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

  // Trạng thái xử lý giỏ hàng
  const [cartLoading, setCartLoading] = useState(false);

  // Đồng bộ trạng thái đăng nhập
  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(localStorage.getItem('userName'));
    };

    window.addEventListener('authChange', syncAuth);
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('authChange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  // Lấy thông tin xe từ state hoặc danh sách xe
  const vehicleFromState = (
    location.state as { vehicle?: Vehicle } | null
  )?.vehicle;

  const selectedVehicle =
    vehicleFromState ??
    allVehicles.find(
      (v) =>
        String(v.id) === String(id) ||
        v.vin === id ||
        `${v.brand}-${v.model}`
          .toLowerCase()
          .replace(/\s+/g, '-') === id
    );

  // Thêm xe vào giỏ hàng
  const handleAddToCart = async (
    item: Vehicle,
    qty: number
  ): Promise<boolean> => {
    // Kiểm tra đăng nhập
    if (!currentUser) {
      setIsLoginOpen(true);
      return false;
    }

    // Kiểm tra số lượng
    if (!Number.isInteger(qty) || qty < 1) {
      alert('Số lượng xe không hợp lệ.');
      return false;
    }

    // Kiểm tra ID xe
    const vehicleId = Number(item.id);
    if (!Number.isInteger(vehicleId) || vehicleId < 1) {
      alert('Không xác định được xe cần thêm vào giỏ hàng.');
      return false;
    }

    try {
      setCartLoading(true);

      await cartService.addToCart(vehicleId);

      // Thông báo cho các component khác cập nhật giỏ hàng
      window.dispatchEvent(new Event('cartChange'));

      alert(
        `Đã thêm ${qty} xe ${item.brand ?? ''} ${item.model ?? ''} vào giỏ hàng thành công!`
      );

      return true;
    } catch (error) {
      console.error('Lỗi khi thêm xe vào giỏ hàng:', error);

      // Xe đã có trong giỏ: báo cho khách, vẫn trả true để luồng đặt cọc đi tiếp
      if (isVehicleAlreadyInCart(error)) {
        alert(getCartErrorMessage(error));
        return true;
      }

      alert(getCartErrorMessage(error));
      return false;
    } finally {
  setCartLoading(false);
}
  };

  // Đăng ký lái thử
  const handleBookTestDrive = (item: Vehicle) => {
    navigate('/test-drive', {
      state: { vehicle: item },
    });
  };

  // Xử lý đăng nhập thành công
  const handleLoginSuccess = (name: string) => {
    localStorage.setItem('userName', name);
    setCurrentUser(name);
    setIsLoginOpen(false);

    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('cartChange'));
  };

  // Đóng popup đăng nhập
  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  return {
    vehicle: selectedVehicle,
    currentUser,
    isLoginOpen,
    cartLoading,
    closeLogin,
    handleAddToCart,
    handleBookTestDrive,
    handleLoginSuccess,
  };
}
