import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import {
  categories as staticCategories,
  commemorativeDates,
} from '@/data/catalog';

import {
  fetchCategories,
  fetchProducts,
  type CategoryRow,
  type ProductRow,
} from '@/lib/api';

import ProductCard from '@/components/ProductCard';

type FilterType = 'category' | 'commemorative';

export default function Catalog() {
  const [params] = useSearchParams();

  const [query, setQuery] = useState(params.get('q') || '');
  const [filterType, setFilterType] =
    useState<FilterType>('category');

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
    const searchQuery = params.get('q');

    if (searchQuery !== null) {
      setQuery(searchQuery);
    }

    if (cat) {
      setActiveCategory(cat);
      setActiveDate(null);
      setFilterType('category');
    }

    if (date) {
      setActiveDate(date);
      setActiveCategory(null);
      setFilterType('commemorative');
    }
  }, [params]);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      /*
       * Produtos e categorias são carregados separadamente.
       * Se as categorias falharem, os produtos continuam aparecendo
       * e o site usa as categorias fixas como alternativa.
       */
      const [productsResult, categoriesResult] =
        await Promise.allSettled([
          fetchProducts(),
          fetchCategories(),
        ]);

      if (productsResult.status === 'rejected') {
        console.error(
          'Erro ao carregar produtos:',
          productsResult.reason,
        );

        const message =
          productsResult.reason instanceof Error
            ? productsResult.reason.message
            : 'Não foi possível carregar os produtos.';

        throw new Error(message);
      }

      setProducts(
        Array.isArray(productsResult.value)
          ? productsResult.value
          : [],
      );

      if (categoriesResult.status === 'fulfilled') {
        setDbCategories(
          Array.isArray(categoriesResult.value)
            ? categoriesResult.value
            : [],
        );
      } else {
        console.warn(
          'Não foi possível carregar as categorias do banco. As categorias padrão serão utilizadas.',
          categoriesResult.reason,
        );

        setDbCategories([]);
      }
    } catch (err) {
      console.error('Erro ao carregar o catálogo:', err);

      setProducts([]);
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Não foi possível carregar os produtos.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const name = product.name?.toLowerCase() ?? '';
      const description =
        product.description?.toLowerCase() ?? '';
      const category = product.category?.toLowerCase() ?? '';

      const commemorative = Array.isArray(product.commemorative)
        ? product.commemorative
        : [];

      const keywords = Array.isArray(product.keywords)
        ? product.keywords
        : [];

      const matchesQuery =
        !normalizedQuery ||
        name.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        category.includes(normalizedQuery) ||
        commemorative.some((date) =>
          String(date).toLowerCase().includes(normalizedQuery),
        ) ||
        keywords.some((keyword) =>
          String(keyword).toLowerCase().includes(normalizedQuery),
        );

      const matchesCategory =
        !activeCategory ||
        product.category === activeCategory;

      const matchesDate =
        !activeDate ||
        commemorative.includes(activeDate);

      return (
        matchesQuery &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [
    products,
    query,
    activeCategory,
    activeDate,
  ]);

  const categoryNames =
    dbCategories.length > 0
      ? dbCategories
          .map((category) => category.name)
          .filter(Boolean)
      : staticCategories;

  const chips =
    filterType === 'category'
      ? categoryNames
      : commemorativeDates;

  const activeChip =
    filterType === 'category'
      ? activeCategory
      : activeDate;

  const selectFilterType = (type: FilterType) => {
    setFilterType(type);

    if (type === 'category') {
      setActiveDate(null);
    } else {
      setActiveCategory(null);
    }
  };

  const selectChip = (chip: string) => {
    if (filterType === 'category') {
      setActiveCategory(chip);
      setActiveDate(null);
    } else {
      setActiveDate(chip);
      setActiveCategory(null);
    }
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveDate(null);
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="text-center">
        <span className="eyebrow">
          Catálogo Inteligente
        </span>

        <h1 className="heading mt-2 text-brand-700">
          Nossos produtos
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-brand-500">
          Pesquise em tempo real e filtre por categoria ou
          data comemorativa. Encontre o presente perfeito em
          segundos.
        </p>
      </div>

      {/* BUSCA */}
      <div className="mx-auto mt-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-400" />

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Buscar por nome, categoria, data comemorativa ou palavra-chave..."
            aria-label="Buscar produtos"
            className="input pl-12 pr-11"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-brand-400 transition-colors hover:bg-nude-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ALTERNAR FILTRO */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-brand-400" />

        <div className="grid w-full max-w-md grid-cols-2 rounded-3xl bg-nude-100 p-1">
          <button
            type="button"
            onClick={() => selectFilterType('category')}
            className={`rounded-3xl px-3 py-2.5 text-sm font-medium transition-colors ${
              filterType === 'category'
                ? 'bg-white text-brand-700 shadow-soft'
                : 'text-brand-500'
            }`}
          >
            Por tipo de produto
          </button>

          <button
            type="button"
            onClick={() =>
              selectFilterType('commemorative')
            }
            className={`rounded-3xl px-3 py-2.5 text-sm font-medium transition-colors ${
              filterType === 'commemorative'
                ? 'bg-white text-brand-700 shadow-soft'
                : 'text-brand-500'
            }`}
          >
            Por data comemorativa
          </button>
        </div>
      </div>

      {/* CATEGORIAS */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={clearFilters}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !activeChip
              ? 'bg-brand-500 text-white'
              : 'bg-nude-100 text-brand-600 hover:bg-nude-200'
          }`}
        >
          Todos
        </button>

        {chips.map((chip) => (
          <button
            type="button"
            key={chip}
            onClick={() => selectChip(chip)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeChip === chip
                ? 'bg-brand-500 text-white'
                : 'bg-nude-100 text-brand-600 hover:bg-nude-200'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* RESULTADOS */}
      {loading ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-brand-400">
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
          <p className="text-sm">
            Carregando produtos...
          </p>
        </div>
      ) : error ? (
        <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="font-medium text-rose-600">
            Não foi possível carregar os produtos.
          </p>

          <p className="mt-2 break-words text-sm text-rose-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void loadCatalog()}
            className="btn-primary mt-5"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <p className="mt-8 text-center text-sm text-brand-400">
            {filtered.length}{' '}
            {filtered.length === 1
              ? 'produto encontrado'
              : 'produtos encontrados'}
          </p>

          {filtered.length === 0 ? (
            <div className="mt-12 text-center text-brand-400">
              <p className="font-display text-2xl">
                Nada por aqui ainda.
              </p>

              <p className="mt-2">
                Tente outra busca ou fale com a gente para um
                personalizado exclusivo.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}