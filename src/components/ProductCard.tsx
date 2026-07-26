import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StoreProduct } from '@/lib/types';
import { whatsappLink } from '@/data/catalog';
import { useStore } from '@/context/StoreContext';

function Badge({ type }: { type: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    destaque: { label: 'Destaque', cls: 'bg-brand-500 text-white' },
    mais_vendido: { label: 'Mais Vendido', cls: 'bg-brand-600 text-white' },
    novo: { label: 'Novo', cls: 'bg-rose-500 text-white' },
    promocao: { label: 'Promoção', cls: 'bg-rose-400 text-white' },
  };
  const c = config[type];
  if (!c) return null;
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-soft ${c.cls}`}>
      {c.label}
    </span>
  );
}

export default function ProductCard({ product }: { product: StoreProduct }) {
  const { isFavorite, toggleFavorite, addToCart } = useStore();
  const fav = isFavorite(product.id);
  const badge = product.badge ?? null;
  const activeVariants = (product.variants ?? []).filter((variant) => variant.is_active !== false);
  const minimumPrice = activeVariants.length
    ? Math.min(...activeVariants.map((variant) => variant.price))
    : product.price;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card group flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-nude-100">
        <Link to={`/produto/${product.id}`}>
          <img
            src={product.images[0] || '/placeholder-product.svg'}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {badge && <Badge type={badge} />}
        </div>

        {/* Favorite */}
        <button
          onClick={() => toggleFavorite(product.id)}
          aria-label="Favoritar"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all duration-300 ${
            fav
              ? 'bg-rose-500 text-white shadow-glow scale-110'
              : 'bg-white/80 text-brand-500 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
        </button>

        {/* Category label */}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-brand-600 backdrop-blur shadow-soft">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/produto/${product.id}`}>
          <h3 className="font-display text-xl font-semibold text-brand-700 transition-colors group-hover:text-rose-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-400">
          {product.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.commemorative.slice(0, 2).map((d) => (
            <span
              key={d}
              className="rounded-full bg-nude-100 px-2.5 py-0.5 text-[11px] text-nude-700"
            >
              {d}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <span className="font-display text-2xl font-semibold text-brand-700">
            {activeVariants.length > 0 && <span className="mr-1 text-sm font-normal text-brand-400">A partir de</span>}
            R$ {minimumPrice.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <a
            href={whatsappLink(`Olá! Tenho interesse no produto ${product.name}.`)}
            target="_blank"
            rel="noreferrer"
            className="btn-rose flex-1"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          {activeVariants.length > 0 ? (
            <Link
              to={`/produto/${product.id}`}
              className="btn-outline px-4"
              aria-label="Escolher opção do produto"
            >
              <Plus className="h-4 w-4" />
            </Link>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="btn-outline px-4"
              aria-label="Adicionar ao carrinho"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
