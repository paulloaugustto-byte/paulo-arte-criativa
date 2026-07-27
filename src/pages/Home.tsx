import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
  Baby,
  GraduationCap,
  TreePine,
  Egg,
  PartyPopper,
  Users,
  CalendarHeart,
} from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import ProductCard from '@/components/ProductCard';
import CategoryHighlights from '@/components/CategoryHighlights';
import DecorativeBg from '@/components/DecorativeBg';
import {
  fetchProducts,
  fetchReviews,
  type ProductRow,
  type ReviewRow,
} from '@/lib/api';
import type { StoreProduct } from '@/lib/types';

const fallbackImage =
  'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80';

const dateCards = [
  {
    name: 'Dia das Mães',
    icon: Heart,
    color: 'from-rose-100 to-rose-50',
    iconColor: 'text-rose-500',
  },
  {
    name: 'Dia dos Pais',
    icon: Users,
    color: 'from-brand-100 to-brand-50',
    iconColor: 'text-brand-500',
  },
  {
    name: 'Natal',
    icon: TreePine,
    color: 'from-nude-100 to-nude-50',
    iconColor: 'text-rose-500',
  },
  {
    name: 'Páscoa',
    icon: Egg,
    color: 'from-nude-100 to-cream-100',
    iconColor: 'text-nude-500',
  },
  {
    name: 'Dia dos Namorados',
    icon: Heart,
    color: 'from-rose-100 to-cream-100',
    iconColor: 'text-rose-400',
  },
  {
    name: 'Professores',
    icon: GraduationCap,
    color: 'from-brand-100 to-cream-100',
    iconColor: 'text-brand-400',
  },
  {
    name: 'Volta às aulas',
    icon: GraduationCap,
    color: 'from-nude-100 to-brand-50',
    iconColor: 'text-brand-500',
  },
  {
    name: 'Chá de bebê',
    icon: Baby,
    color: 'from-rose-50 to-nude-50',
    iconColor: 'text-rose-400',
  },
  {
    name: 'Casamento',
    icon: Heart,
    color: 'from-cream-100 to-rose-50',
    iconColor: 'text-rose-500',
  },
  {
    name: 'Aniversário',
    icon: PartyPopper,
    color: 'from-nude-100 to-rose-50',
    iconColor: 'text-rose-400',
  },
  {
    name: 'Empresas',
    icon: Users,
    color: 'from-brand-50 to-nude-50',
    iconColor: 'text-brand-500',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState<ProductRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const { settings } = useSiteSettings();

  const whatsappNumber = (
    settings.whatsapp_number || '5565998022115'
  ).replace(/\D/g, '');

  const whatsappUrl = (message: string) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    fetchProducts()
      .then((data) =>
        setFeatured(data.filter((product) => product.featured).slice(0, 4)),
      )
      .catch(() => setFeatured([]));

    fetchReviews()
      .then((data) => setReviews(data.slice(0, 4)))
      .catch(() => setReviews([]));
  }, []);

  return (
    <div className="paper-texture">
      {/* HERO DESKTOP / TABLET */}
      <section
        className="relative isolate hidden min-h-[640px] overflow-hidden bg-[#f8f0eb] md:flex lg:min-h-[clamp(680px,41.6667vw,800px)]"
        aria-label="Paulo Arte Criativa"
      >
        <img
          src="/hero-banner.png"
          alt="Paulo Arte Criativa — transformando papel em emoções"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute left-8 top-16 z-20 w-[245px] rounded-[24px] border border-white/60 bg-white/40 p-3 shadow-[0_18px_45px_rgba(24,46,82,0.18)] backdrop-blur-xl lg:left-10 lg:top-16 xl:left-12"
        >
          <div className="flex flex-col gap-3">
            <Link
              to="/catalogo"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(24,46,82,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-800 hover:shadow-[0_16px_36px_rgba(24,46,82,0.28)] focus:outline-none focus:ring-4 focus:ring-brand-200"
            >
              Ver Catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={whatsappUrl(
                'Olá! Gostaria de solicitar um orçamento.',
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(225,108,116,0.24)] transition-all duration-300 hover:-translate-y-1 hover:bg-rose-600 hover:shadow-[0_16px_36px_rgba(225,108,116,0.30)] focus:outline-none focus:ring-4 focus:ring-rose-200"
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar Orçamento
            </a>

            <a
              href="https://www.instagram.com/pauloartecriativa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Paulo Arte Criativa"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(221,42,123,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(221,42,123,0.30)] focus:outline-none focus:ring-4 focus:ring-pink-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <rect
                  width="18"
                  height="18"
                  x="3"
                  y="3"
                  rx="5"
                  ry="5"
                />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
                <line
                  x1="17.5"
                  x2="17.51"
                  y1="6.5"
                  y2="6.5"
                />
              </svg>

              Siga no Instagram
            </a>
          </div>
        </motion.div>
      </section>

      {/* HERO CELULAR */}
      <section
        className="overflow-hidden bg-[#fff3ec] md:hidden"
        aria-label="Paulo Arte Criativa"
      >
        <div className="w-full overflow-hidden">
          <img
            src="/hero-mobile.png"
            alt="Paulo Arte Criativa — transformando papel em emoções"
            className="block h-auto w-full"
            fetchPriority="high"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10 -mt-20 px-4 pb-6"
        >
          <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-white/70 bg-white/70 p-2.5 shadow-[0_16px_40px_rgba(24,46,82,0.16)] backdrop-blur-md">
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/catalogo"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(24,46,82,0.22)] transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-brand-200"
              >
                Ver Catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={whatsappUrl(
                  'Olá! Gostaria de solicitar um orçamento.',
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(225,108,116,0.24)] transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-rose-200"
              >
                <MessageCircle className="h-4 w-4" />
                Orçamento
              </a>

              <a
                href="https://www.instagram.com/pauloartecriativa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Paulo Arte Criativa"
                className="col-span-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-4 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(221,42,123,0.22)] transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-pink-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect
                    width="18"
                    height="18"
                    x="3"
                    y="3"
                    rx="5"
                    ry="5"
                  />

                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />

                  <line
                    x1="17.5"
                    x2="17.51"
                    y1="6.5"
                    y2="6.5"
                  />
                </svg>

                Siga no Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <CategoryHighlights />

      {/* DATAS COMEMORATIVAS */}
      <section className="relative overflow-hidden bg-nude-100 py-16">
        <DecorativeBg variant="subtle" />

        <div className="container-page relative">
          <div className="text-center">
            <span className="eyebrow flex items-center justify-center gap-2">
              <CalendarHeart className="h-4 w-4" />
              Datas Comemorativas
            </span>

            <h2 className="heading mt-2 text-brand-700">
              Presenteie em cada ocasião
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-brand-400">
              Temos o presente perfeito para cada momento especial do ano.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {dateCards.map((date, index) => (
              <motion.div
                key={date.name}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
              >
                <Link
                  to={`/catalogo?date=${encodeURIComponent(
                    date.name,
                  )}`}
                  className={`group flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br ${date.color} p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 transition-transform duration-300 group-hover:scale-110">
                    <date.icon
                      className={`h-6 w-6 ${date.iconColor}`}
                    />
                  </div>

                  <span className="text-sm font-semibold text-brand-600">
                    {date.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Escolhas especiais</span>

            <h2 className="heading mt-2 text-brand-700">
              ❤️ Os Favoritos dos Clientes
            </h2>
          </div>

          <Link
            to="/catalogo"
            className="btn-ghost hidden sm:inline-flex"
          >
            Ver tudo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.length > 0 ? (
            featured.map((product) => (
              <ProductCard
                key={product.id}
                product={
                  product as unknown as StoreProduct
                }
              />
            ))
          ) : (
            <p className="col-span-full text-center text-brand-400">
              Nenhum favorito selecionado ainda.
            </p>
          )}
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section className="container-page py-16">
        <div className="card grid items-center gap-10 overflow-hidden p-0 lg:grid-cols-2">
          <div className="h-full">
            <img
              src={fallbackImage}
              alt="Atelier Paulo Arte Criativa"
              className="h-full min-h-[300px] w-full object-cover"
            />
          </div>

          <div className="p-10 lg:p-14">
            <span className="eyebrow">Quem Somos</span>

            <h2 className="heading mt-3 text-brand-700">
              Arte feita com
              <br />

              <span className="font-script text-5xl italic text-rose-500 lg:text-6xl">
                carinho
              </span>
            </h2>

            <p className="mt-5 leading-relaxed text-brand-500">
              Trabalhamos com personalizados feitos à mão, com criatividade e
              acabamento de alta qualidade. Cada peça é única, pensada para
              emocionar quem recebe.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-brand-600">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-500" />
                Atendimento personalizado
              </li>

              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-500" />
                Produtos exclusivos
              </li>

              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-500" />
                Qualidade premium e produção artesanal
              </li>

              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-500" />
                Entrega para todo o Brasil
              </li>
            </ul>

            <Link
              to="/sobre"
              className="btn-primary mt-8"
            >
              Nossa história
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section className="container-page py-16">
        <div className="text-center">
          <span className="eyebrow">Avaliações</span>

          <h2 className="heading mt-2 text-brand-700">
            Quem comprou, amou
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <div className="flex gap-0.5">
                  {Array.from({
                    length: review.rating,
                  }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-rose-500 text-rose-500"
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-brand-500">
                  &quot;{review.comment}&quot;
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-rose-100"
                  />

                  <span className="font-semibold text-brand-700">
                    {review.name}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-brand-400">
              Carregando avaliações...
            </p>
          )}
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-rose-100 via-cream-100 to-nude-100 px-8 py-16 text-center shadow-soft-lg sm:px-16">
          <DecorativeBg variant="subtle" />

          <div className="relative">
            <h2 className="heading text-brand-700">
              Vamos criar algo inesquecível?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-brand-500">
              Fale com a gente pelo WhatsApp e transforme sua ideia em um
              presente único.
            </p>

            <a
              href={whatsappUrl(
                'Olá! Quero criar um personalizado exclusivo.',
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-rose mt-8"
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}