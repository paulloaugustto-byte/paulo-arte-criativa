import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { fetchProducts, type ProductRow } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function Favorites() {
  const { favorites } = useStore();
  const [allProducts, setAllProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const favProducts = allProducts.filter((p) => favorites.includes(p.id));

  return (
    <div className="container-page py-12">
      <div className="flex items-center gap-3">
        <Heart className="h-7 w-7 text-rose-500" />
        <h1 className="heading text-brand-700">Meus favoritos</h1>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
        </div>
      ) : favProducts.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="font-display text-2xl text-brand-600">Sua lista de desejos está vazia.</p>
          <p className="mt-2 text-brand-400">
            Explore o catálogo e toque no coração para salvar seus produtos preferidos.
          </p>
          <Link to="/catalogo" className="btn-primary mt-8">Ver catálogo</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
