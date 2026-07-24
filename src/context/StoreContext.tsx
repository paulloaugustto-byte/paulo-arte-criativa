import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { StoreProduct } from '@/lib/types';

interface CartItem {
  product: StoreProduct;
  quantity: number;
}

interface StoreContextValue {
  favorites: string[];
  cart: CartItem[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addToCart: (product: StoreProduct, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('pac-favorites') || '[]');
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('pac-cart') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('pac-favorites', JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem('pac-cart', JSON.stringify(cart));
  }, [cart]);

  const value = useMemo<StoreContextValue>(() => {
    const toggleFavorite = (id: string) =>
      setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    const isFavorite = (id: string) => favorites.includes(id);
    const addToCart = (product: StoreProduct, quantity = 1) =>
      setCart((c) => {
        const existing = c.find((i) => i.product.id === product.id);
        if (existing)
          return c.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
          );
        return [...c, { product, quantity }];
      });
    const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.product.id !== id));
    const updateQuantity = (id: string, quantity: number) =>
      setCart((c) =>
        c.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)),
      );
    const clearCart = () => setCart([]);
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = cart.reduce((sum, i) => sum + i.quantity * i.product.price, 0);
    return {
      favorites,
      cart,
      toggleFavorite,
      isFavorite,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    };
  }, [favorites, cart]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
