export interface CategoryItem {
  id: number;
  name: string;
  count?: string;
  tag?: string;
}

export interface HeaderProps {
  cartCount?: number;
  onSearch?: (keyword: string) => void;
}