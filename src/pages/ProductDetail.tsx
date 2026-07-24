import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Loader2, MessageCircle, Minus, Plus, ShoppingBag, ZoomIn } from 'lucide-react';
import { whatsappLink } from '@/data/catalog';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { fetchProduct, fetchProducts, type ProductRow } from '@/lib/api';
import type { StoreProduct } from '@/lib/types';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [allProducts, setAllProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const { isFavorite, toggleFavorite, addToCart } = useStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActive(0);
    setQty(1);
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
              src={product.images[active]}
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
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>

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
            <a
              href={whatsappLink(`Olá! Tenho interesse no produto ${product.name} (quantidade: ${qty}).`)}
              target="_blank"
              rel="noreferrer"
              className="btn-rose flex-1"
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar pelo WhatsApp
            </a>
            <button
              onClick={() => addToCart(storeProduct, qty)}
              className="btn-primary flex-1"
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
            src={product.images[active]}
            alt={product.name}
            className="max-h-full max-w-full rounded-3xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
