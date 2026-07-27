import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { fetchCategories, type CategoryRow } from '@/lib/api';

export default function CategoryHighlights() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();

        if (isMounted) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="container-page pb-16 pt-10 sm:py-16">
      <div className="text-center">
        <span className="eyebrow">Encontre mais rápido</span>

        <h2 className="heading mt-2 text-brand-700">
          Escolha o que deseja personalizar
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-brand-400">
          Acesse diretamente nossas categorias e encontre o produto ideal em
          poucos cliques.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              delay: index * 0.06,
            }}
          >
            <Link
              to={`/catalogo?cat=${encodeURIComponent(category.name)}`}
              className="group flex h-full items-start gap-4 rounded-3xl bg-white p-6 shadow-card ring-1 ring-nude-200/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-nude-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <ShoppingBag className="h-7 w-7 text-rose-500" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-semibold text-brand-700">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-brand-400">
                  Conheça os produtos personalizados disponíveis nesta
                  categoria.
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 transition-colors group-hover:text-rose-500">
                  Ver produtos

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}