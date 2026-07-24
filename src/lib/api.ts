import { supabase } from '@/lib/supabase';
import type {
  ProductRow,
  ProductImageRow,
  CategoryRow,
  GalleryRow,
  ReviewRow,
  OrderRow,
  CustomerRow,
  CouponRow,
  DigitalFileRow,
  SiteSettingRow,
} from '@/lib/types';

export type {
  ProductRow,
  ProductImageRow,
  CategoryRow,
  GalleryRow,
  ReviewRow,
  OrderRow,
  CustomerRow,
  CouponRow,
  DigitalFileRow,
  SiteSettingRow,
};

// ============ PRODUCTS ============

export async function fetchProducts(includeInactive = false): Promise<ProductRow[]> {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (!includeInactive) query = query.eq('is_active', true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchProduct(id: string): Promise<ProductRow | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProduct(p: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .insert(p)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, p: Partial<ProductRow>): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .update({ ...p, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ============ PRODUCT IMAGES ============

export async function fetchProductImages(productId: string): Promise<ProductImageRow[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addProductImage(productId: string, url: string, thumbnailUrl: string | null, sortOrder: number, isMain: boolean): Promise<ProductImageRow> {
  const { data, error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, url, thumbnail_url: thumbnailUrl, sort_order: sortOrder, is_main: isMain })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProductImage(id: string, updates: Partial<ProductImageRow>): Promise<void> {
  const { error } = await supabase.from('product_images').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteProductImage(id: string): Promise<void> {
  const { error } = await supabase.from('product_images').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderProductImages(images: { id: string; sort_order: number; is_main: boolean }[]): Promise<void> {
  for (const img of images) {
    await updateProductImage(img.id, { sort_order: img.sort_order, is_main: img.is_main });
  }
}

// ============ CATEGORIES ============

export async function fetchCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createCategory(name: string, icon?: string): Promise<CategoryRow> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug, icon, sort_order: 0 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ============ GALLERY ============

export async function fetchGallery(): Promise<GalleryRow[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ============ REVIEWS ============

export async function fetchReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createReview(r: Omit<ReviewRow, 'id' | 'created_at'>): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from('reviews')
    .insert(r)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}

// ============ ORDERS ============

export async function fetchOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}

// ============ CUSTOMERS ============

export async function fetchCustomers(): Promise<CustomerRow[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ============ COUPONS ============

export async function fetchCoupons(): Promise<CouponRow[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCoupon(c: Omit<CouponRow, 'id' | 'created_at'>): Promise<CouponRow> {
  const { data, error } = await supabase
    .from('coupons')
    .insert(c)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCoupon(id: string): Promise<void> {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw error;
}

// ============ DIGITAL FILES ============

export async function fetchDigitalFiles(): Promise<DigitalFileRow[]> {
  const { data, error } = await supabase
    .from('digital_files')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllDigitalFiles(): Promise<DigitalFileRow[]> {
  const { data, error } = await supabase
    .from('digital_files')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createDigitalFile(f: Omit<DigitalFileRow, 'id' | 'created_at'>): Promise<DigitalFileRow> {
  const { data, error } = await supabase
    .from('digital_files')
    .insert(f)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDigitalFile(id: string, updates: Partial<DigitalFileRow>): Promise<void> {
  const { error } = await supabase.from('digital_files').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteDigitalFile(id: string): Promise<void> {
  const { error } = await supabase.from('digital_files').delete().eq('id', id);
  if (error) throw error;
}

// ============ SITE SETTINGS ============

export async function fetchSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of (data ?? []) as SiteSettingRow[]) {
    if (row.value) map[row.key] = row.value;
  }
  return map;
}

export async function updateSiteSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}

// ============ STORAGE ============

export async function uploadProductImage(file: File, productId: string): Promise<{ url: string; thumbnailUrl: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
  const url = urlData.publicUrl;

  // Thumbnail: same URL with resize params (Supabase image transforms)
  const thumbnailUrl = `${url}&width=300&height=300&resize=cover`;

  return { url, thumbnailUrl };
}

export async function deleteStorageImage(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/product-images/')[1];
    if (path) {
      await supabase.storage.from('product-images').remove([path]);
    }
  } catch {
    // URL might be external, ignore
  }
}
