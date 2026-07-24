import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { categories as staticCategories, commemorativeDates } from '@/data/catalog';
import { fetchProducts, fetchCategories, type ProductRow, type CategoryRow } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

type FilterType = 'all' | 'category' | 'commemorative';

export default function Catalog() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [filterType, setFilterType] = useState<FilterType>('category');
  const [activeCategory, setActiveCategory] = useState<string | null>(
    params.get('cat') || null,
  );
  const [activeDate, setActiveDate] = useState<string | null>(
    params.get('date') || null,
  );
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cat = params.get('cat');
    const date = params.get('date');
    if (cat) { setActiveCategory(cat); setFilterType('category'); }
    if (date) { setActiveDate(date); setFilterType('commemorative'); }
  }, [params]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([prods, cats]) => {
        if (active) { setProducts(prods); setDbCategories(cats); setError(null); }
      })
      .catch(() => { if (active) setError('Não foi possível carregar os produtos.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.commemorative.some((d: string) => d.toLowerCase().includes(q)) ||
        (p.keywords || []).some((k: string) => k.toLowerCase().includes(q));
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const matchesDate = !activeDate || p.commemorative.includes(activeDate);
      return matchesQuery && matchesCategory && matchesDate;
    });
  }, [products, query, activeCategory, activeDate]);

  const categoryNames = dbCategories.length > 0 ? dbCategories.map((c) => c.name) : staticCategories;
  const chips = filterType === 'category' ? categoryNames : commemorativeDates;
  const activeChip = filterType === 'category' ? activeCategory : activeDate;

  return (
    <div className="container-page py-12">
      <div className="text-center">
        <span className="eyebrow">Catálogo Inteligente</span>
        <h1 className="heading mt-2 text-brand-700">Nossos produtos</h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-500">
          Pesquise em tempo real e filtre por categoria ou data comemorativa. Encontre o presente
          perfeito em segundos.
        </p>
      </div>

      {/* SEARCH */}
      <div className="mx-auto mt-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, categoria, data comemorativa ou palavra-chave..."
            className="input pl-12"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-brand-400 hover:bg-nude-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* FILTER TOGGLE */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-brand-400" />
        <div className="inline-flex rounded-full bg-nude-100 p-1">
          <button
            onClick={() => { setFilterType('category'); setActiveDate(null); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filterType === 'category'
                ? 'bg-white text-brand-700 shadow-soft'
                : 'text-brand-500'
            }`}
          >
            Por tipo de produto
          </button>
          <button
            onClick={() => { setFilterType('commemorative'); setActiveCategory(null); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filterType === 'commemorative'
                ? 'bg-white text-brand-700 shadow-soft'
                : 'text-brand-500'
            }`}
          >
            Por data comemorativa
          </button>
        </div>
      </div>

      {/* CHIPS */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => {
            setActiveCategory(null);
            setActiveDate(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !activeChip
              ? 'bg-brand-500 text-white'
              : 'bg-nude-100 text-brand-600 hover:bg-nude-200'
          }`}
        >
          Todos
        </button>
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => {
              if (filterType === 'category') setActiveCategory(c);
              else setActiveDate(c);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeChip === c
                ? 'bg-brand-500 text-white'
                : 'bg-nude-100 text-brand-600 hover:bg-nude-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* RESULTS */}
      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
        </div>
      ) : error ? (
        <div className="mt-12 text-center text-rose-500">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <p className="mt-8 text-center text-sm text-brand-400">
            {filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
          {filtered.length === 0 ? (
            <div className="mt-12 text-center text-brand-400">
              <p className="font-display text-2xl">Nada por aqui ainda.</p>
              <p className="mt-2">Tente outra busca ou fale com a gente para um personalizado exclusivo.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
