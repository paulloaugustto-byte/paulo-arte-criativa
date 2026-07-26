export type Badge = 'destaque' | 'mais_vendido' | 'novo' | 'promocao' | null;

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  is_active?: boolean;
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  commemorative: string[];
  price: number;
  original_price?: number | null;
  images: string[];
  featured?: boolean;
  badge?: Badge;
  is_active?: boolean;
  sales_count?: number;
  keywords?: string[];
  option_name?: string | null;
  variants?: ProductVariant[];
}

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  category: string;
  commemorative: string[];
  price: number;
  original_price: number | null;
  images: string[];
  featured: boolean;
  badge: Badge;
  is_active: boolean;
  sales_count: number;
  keywords: string[];
  option_name: string | null;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_main: boolean;
  created_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface GalleryRow {
  id: string;
  src: string;
  alt: string;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface OrderRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_id: string | null;
  items: Record<string, unknown>[];
  total: number;
  status: string;
  created_at: string;
}

export interface CustomerRow {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  created_at: string;
}

export interface CouponRow {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface DigitalFileRow {
  id: string;
  name: string;
  description: string;
  format: string;
  price: number;
  is_free: boolean;
  file_url: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface SiteSettingRow {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}
