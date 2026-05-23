export type Category = "electronics" | "clothing" | "home" | "accessories";

export type ProductBadge = "new" | "bestseller" | "sale";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  category: Category;
  description: string;
  rating: number;
  reviewCount: number;
  badge?: ProductBadge;
  featured?: boolean;
  sizes?: string[];
  colors?: ProductColor[];
  stock: number;
}

export interface CartItemOptions {
  size?: string;
  color?: string;
}

export interface CartItem {
  lineId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  savedForLater?: boolean;
}

export interface OrderRecord {
  id: string;
  date: string;
  total: number;
  itemCount: number;
  items: { name: string; quantity: number; price: number; image: string }[];
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name"
  | "rating"
  | "newest";

export type ViewMode = "grid" | "list";

export interface CatalogFilters {
  search: string;
  category: string;
  sort: SortOption;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
}

export interface ToastState {
  visible: boolean;
  message: string;
  image?: string;
  variant?: "success" | "info";
}
