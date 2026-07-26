import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ProductVariant, StoreProduct } from '@/lib/types';

export interface CartItem {
  key: string;
  product: StoreProduct;
  quantity: number;
  variant: ProductVariant | null;
  unitPrice: number;
}

interface StoreContextValue {
  favorites: string[];
  cart: CartItem[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addToCart: (product: StoreProduct, quantity?: number, variant?: ProductVariant | null) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function normalizeCart(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((raw) => {
    const item = raw as Partial<CartItem> & { product?: StoreProduct; quantity?: number };
    if (!item.product?.id) return [];
    const variant = item.variant && typeof item.variant.id === 'string' && typeof item.variant.name === 'string' && Number.isFinite(Number(item.variant.price))
      ? { ...item.variant, price: Number(item.variant.price) }
      : null;
    const key = item.key ?? `${item.product.id}:${variant?.id ?? 'default'}`;
    const unitPriceValue = Number(item.unitPrice ?? variant?.price ?? item.product.price ?? 0);
    const unitPrice = Number.isFinite(unitPriceValue) && unitPriceValue >= 0 ? unitPriceValue : 0;
    return [{ key, product: item.product, variant, unitPrice, quantity: Math.max(1, Number(item.quantity) || 1) }];
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readLocalStorage('pac-favorites', []));
  const [cart, setCart] = useState<CartItem[]>(() => normalizeCart(readLocalStorage('pac-cart', [])));

  useEffect(() => localStorage.setItem('pac-favorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('pac-cart', JSON.stringify(cart)), [cart]);

  const value = useMemo<StoreContextValue>(() => {
    const toggleFavorite = (id: string) =>
      setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
    const isFavorite = (id: string) => favorites.includes(id);
    const addToCart = (product: StoreProduct, quantity = 1, variant: ProductVariant | null = null) => {
      const key = `${product.id}:${variant?.id ?? 'default'}`;
      const unitPrice = variant?.price ?? product.price;
      setCart((current) => {
        const existing = current.find((item) => item.key === key);
        if (existing) {
          return current.map((item) => item.key === key
            ? { ...item, quantity: item.quantity + Math.max(1, quantity), unitPrice, variant }
            : item);
        }
        return [...current, { key, product, quantity: Math.max(1, quantity), variant, unitPrice }];
      });
    };
    const removeFromCart = (key: string) => setCart((current) => current.filter((item) => item.key !== key));
    const updateQuantity = (key: string, quantity: number) =>
      setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item));
    const clearCart = () => setCart([]);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    return { favorites, cart, toggleFavorite, isFavorite, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal };
  }, [favorites, cart]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
