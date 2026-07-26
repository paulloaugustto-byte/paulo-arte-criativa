import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Loader2, MessageCircle, Minus, Plus, ShoppingBag, ZoomIn } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { fetchProduct, fetchProducts, type ProductRow } from '@/lib/api';
import type { ProductVariant, StoreProduct } from '@/lib/types';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [allProducts, setAllProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const { isFavorite, toggleFavorite, addToCart } = useStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActive(0);
    setQty(1);
    setSelectedVariantId('');
    Promise.all([fetchProduct(id), fetchProducts()])
      .then(([p, all]) => {
        setProduct(p);
        setAllProducts(all);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="heading text-brand-700">Produto não encontrado</h1>
        <Link to="/catalogo" className="btn-primary mt-8">Voltar ao catálogo</Link>
      </div>
    );
  }

  const storeProduct: StoreProduct = product;
  const activeVariants = (product.variants ?? []).filter((variant) => variant.is_active !== false);
  const selectedVariant: ProductVariant | null =
    activeVariants.find((variant) => variant.id === selectedVariantId) ?? null;
  const minimumVariantPrice = activeVariants.length ? Math.min(...activeVariants.map((variant) => variant.price)) : product.price;
  const displayedPrice = selectedVariant?.price ?? minimumVariantPrice;
  const requiresVariant = activeVariants.length > 0;
  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const fallbackRelated = allProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const relatedProducts = related.length ? related : fallbackRelated;

  return (
    <div className="container-page py-12">
      <Link to="/catalogo" className="btn-ghost mb-8">
        <ArrowLeft className="h-4 w-4" /> Catálogo
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* GALLERY */}
        <div>
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="group relative cursor-zoom-in overflow-hidden rounded-4xl shadow-soft-lg"
            onClick={() => setZoom(true)}
          >
            <img
              src={product.images[active] || '/placeholder-product.svg'}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-brand-800/0 opacity-0 transition-all group-hover:bg-brand-800/20 group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-brand-700 backdrop-blur">
                <ZoomIn className="h-4 w-4" /> Ampliar
              </span>
            </div>
          </motion.div>

          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-20 w-20 overflow-hidden rounded-2xl ring-2 transition-all ${
                    active === i ? 'ring-rose-500' : 'ring-transparent hover:ring-brand-200'
                  }`}
                >
                  <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <span className="eyebrow">{product.category}</span>
          <h1 className="heading mt-2 text-brand-700">{product.name}</h1>
          <p className="mt-5 leading-relaxed text-brand-500">{product.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.commemorative.map((d: string) => (
              <span key={d} className="rounded-full bg-nude-100 px-3 py-1 text-xs text-nude-700">
                {d}
              </span>
            ))}
          </div>

          <p className="mt-6 font-display text-4xl font-semibold text-brand-700">
            {requiresVariant && !selectedVariant ? 'A partir de ' : ''}R$ {displayedPrice.toFixed(2).replace('.', ',')}
          </p>

          {requiresVariant && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-brand-700">
                Escolha {product.option_name?.toLowerCase() || 'uma opção'}
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeVariants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                      selectedVariantId === variant.id
                        ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-100'
                        : 'border-nude-300 text-brand-600 hover:border-rose-300'
                    }`}
                  >
                    <span className="block font-medium">{variant.name}</span>
                    <span className="text-sm">R$ {variant.price.toFixed(2).replace('.', ',')}</span>
                  </button>
                ))}
              </div>
              {!selectedVariant && (
                <p className="mt-2 text-sm text-rose-600">Selecione uma opção antes de adicionar ao carrinho.</p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-nude-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="rounded-l-full p-3 text-brand-600 hover:bg-nude-100"
                aria-label="Diminuir"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium text-brand-700">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="rounded-r-full p-3 text-brand-600 hover:bg-nude-100"
                aria-label="Aumentar"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                isFavorite(product.id)
                  ? 'bg-rose-500 text-white'
                  : 'border border-nude-300 text-brand-600 hover:border-rose-300'
              }`}
              aria-label="Favoritar"
            >
              <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {requiresVariant && !selectedVariant ? (
              <button type="button" disabled className="btn-rose flex-1 cursor-not-allowed opacity-50">
                <MessageCircle className="h-4 w-4" />
                Escolha uma opção
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addToCart(storeProduct, qty, selectedVariant);
                  navigate('/revisar-pedido');
                }}
                className="btn-rose flex-1"
              >
                <MessageCircle className="h-4 w-4" />
                Revisar e solicitar
              </button>
            )}
            <button
              onClick={() => {
                if (requiresVariant && !selectedVariant) return;
                addToCart(storeProduct, qty, selectedVariant);
              }}
              disabled={requiresVariant && !selectedVariant}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <section className="mt-20">
        <h2 className="heading text-brand-700">Produtos relacionados</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ZOOM MODAL */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/90 p-4 backdrop-blur"
        >
          <button className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={product.images[active] || '/placeholder-product.svg'}
            alt={product.name}
            className="max-h-full max-w-full rounded-3xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
