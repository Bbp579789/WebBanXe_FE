import type { VehicleCardItem } from './index';

export interface ProductCardProps {
  car: VehicleCardItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onAddToCart?: (car: VehicleCardItem) => void;
  onDeposit?: (car: VehicleCardItem) => void;
}