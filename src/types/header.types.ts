// export interface CategoryItem {
//   id: number;
//   name: string;
//   count?: string;
//   tag?: string;
// }

// export interface HeaderProps {
//   cartCount?: number;
//   onSearch?: (keyword: string) => void;
// }

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

export interface HeaderSearchProps {
  isSolid: boolean;
  onSearch?: (keyword: string) => void;
}

export interface AccountAvatarProps {
  userName?: string | null;
  avatarUrl?: string;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export interface CategorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}

export interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
}