import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Gift,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
  Truck,
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
import { fetchProducts, fetchReviews, type ProductRow, type ReviewRow } from '@/lib/api';
import type { StoreProduct } from '@/lib/types';

const fallbackImage = 'https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop';

const px = (id: number, w = 600, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const heroCards = [
  {
    src: px(6102496, 500, 600),
    label: 'Caixa Explosão',
    className: 'aspect-[4/5] w-[50%] left-[2%] top-[2%]',
    rotate: '-4deg',
    delay: 0,
    z: 'z-20',
  },
  {
    src: px(7764457, 400, 400),
    label: 'Canecas',
    className: 'aspect-square w-[38%] right-[0%] top-[8%]',
    rotate: '5deg',
    delay: 0.15,
    z: 'z-30',
  },
  {
    src: px(7564191, 400, 400),
    label: 'Sacolas',
    className: 'aspect-square w-[36%] left-[8%] bottom-[2%]',
    rotate: '-6deg',
    delay: 0.3,
    z: 'z-10',
  },
  {
    src: px(16897958, 400, 400),
    label: 'Kits Presente',
    className: 'aspect-square w-[34%] right-[6%] bottom-[6%]',
    rotate: '7deg',
    delay: 0.45,
    z: 'z-30',
  },
];

const floatingBadges = [
  { icon: Sparkles, text: 'Feito com carinho', className: 'right-0 top-0', delay: 0.6, color: 'text-rose-500' },
  { icon: Gift, text: 'Personalizado', className: 'left-0 top-1/2', delay: 0.75, color: 'text-brand-500' },
  { icon: Star, text: 'Mais vendido', className: 'right-2 bottom-1/4', delay: 0.9, color: 'text-rose-400' },
  { icon: Truck, text: 'Enviamos para todo Brasil', className: 'left-2 bottom-0', delay: 1.05, color: 'text-brand-400' },
];

const dateCards = [
  { name: 'Dia das Mães', icon: Heart, color: 'from-rose-100 to-rose-50', iconColor: 'text-rose-500' },
  { name: 'Dia dos Pais', icon: Users, color: 'from-brand-100 to-brand-50', iconColor: 'text-brand-500' },
  { name: 'Natal', icon: TreePine, color: 'from-nude-100 to-nude-50', iconColor: 'text-rose-500' },
  { name: 'Páscoa', icon: Egg, color: 'from-nude-100 to-cream-100', iconColor: 'text-nude-500' },
  { name: 'Dia dos Namorados', icon: Heart, color: 'from-rose-100 to-cream-100', iconColor: 'text-rose-400' },
  { name: 'Professores', icon: GraduationCap, color: 'from-brand-100 to-cream-100', iconColor: 'text-brand-400' },
  { name: 'Volta às aulas', icon: GraduationCap, color: 'from-nude-100 to-brand-50', iconColor: 'text-brand-500' },
  { name: 'Chá de bebê', icon: Baby, color: 'from-rose-50 to-nude-50', iconColor: 'text-rose-400' },
  { name: 'Casamento', icon: Heart, color: 'from-cream-100 to-rose-50', iconColor: 'text-rose-500' },
  { name: 'Aniversário', icon: PartyPopper, color: 'from-nude-100 to-rose-50', iconColor: 'text-rose-400' },
  { name: 'Empresas', icon: Users, color: 'from-brand-50 to-nude-50', iconColor: 'text-brand-500' },
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
      .then((data) => setFeatured(data.filter((p) => p.featured).slice(0, 4)))
      .catch(() => setFeatured([]));
    fetchReviews()
      .then((data) => setReviews(data.slice(0, 4)))
      .catch(() => setReviews([]));
  }, []);

  return (
    <div className="paper-texture">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <DecorativeBg />
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          {/* LEFT: TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">Personalizados de alto padrão</span>
            <h1 className="heading mt-4 text-brand-700">
              Transformando papel<br />em <span className="font-script text-rose-500 text-5xl lg:text-7xl italic">emoções</span>.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-500">
              Criamos personalizados exclusivos para transformar cada presente em uma lembrança
              inesquecível.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn-primary">
                Ver Catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl('Olá! Gostaria de solicitar um orçamento.')}
                target="_blank"
                rel="noreferrer"
                className="btn-rose"
              >
                <MessageCircle className="h-4 w-4" />
                Solicitar Orçamento
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-6">
              {[
                { icon: Sparkles, label: '100% exclusivos' },
                { icon: Truck, label: 'Entrega nacional' },
                { icon: Star, label: '4.9★ avaliação' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.icon className="h-5 w-5 text-rose-500" />
                  <span className="text-sm font-medium text-brand-600">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: VITRINE COMPOSITION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto h-[500px] w-full max-w-lg sm:h-[580px]"
          >
            {/* Decorative rings */}
            <div className="absolute inset-6 rounded-[3rem] border-2 border-dashed border-rose-200/40" />
            <div className="absolute inset-14 rounded-[2.5rem] border border-nude-200/50" />

            {/* Product cards */}
            {heroCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: card.rotate }}
                transition={{ duration: 0.7, delay: card.delay, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute ${card.className} ${card.z}`}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
                  className="group relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-soft-lg ring-1 ring-nude-200/50"
                >
                  <img
                    src={card.src}
                    alt={card.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-800/60 to-transparent p-3 pt-8">
                    <span className="text-xs font-medium text-white">{card.label}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {/* Floating info badges */}
            {floatingBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: badge.delay }}
                className={`absolute ${badge.className} z-40`}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: badge.delay }}
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-soft-lg"
                >
                  <badge.icon className={`h-4 w-4 ${badge.color}`} />
                  <span className="text-xs font-semibold text-brand-700">{badge.text}</span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-nude-200/60 py-6 text-xs font-medium uppercase tracking-wider text-brand-400">
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-rose-500" /> Produção Artesanal</span>
            <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-rose-500" /> Envio Nacional</span>
            <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" /> Atendimento Personalizado</span>
            <span className="flex items-center gap-2"><Star className="h-4 w-4 text-rose-500" /> Qualidade Premium</span>
          </div>
        </div>
      </section>

      <CategoryHighlights />

      {/* COMMEMORATIVE DATES */}
      <section className="relative overflow-hidden bg-nude-100 py-16">
        <DecorativeBg variant="subtle" />
        <div className="container-page relative">
          <div className="text-center">
            <span className="eyebrow flex items-center justify-center gap-2">
              <CalendarHeart className="h-4 w-4" /> Datas Comemorativas
            </span>
            <h2 className="heading mt-2 text-brand-700">Presenteie em cada ocasião</h2>
            <p className="mx-auto mt-4 max-w-lg text-brand-400">
              Temos o presente perfeito para cada momento especial do ano.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {dateCards.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/catalogo?date=${encodeURIComponent(d.name)}`}
                  className={`group flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br ${d.color} p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 transition-transform duration-300 group-hover:scale-110">
                    <d.icon className={`h-6 w-6 ${d.iconColor}`} />
                  </div>
                  <span className="text-sm font-semibold text-brand-600">{d.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Escolhas especiais</span>
            <h2 className="heading mt-2 text-brand-700">❤️ Os Favoritos dos Clientes</h2>
          </div>
          <Link to="/catalogo" className="btn-ghost hidden sm:inline-flex">
            Ver tudo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.length > 0 ? (
            featured.map((p) => (
              <ProductCard key={p.id} product={p as unknown as StoreProduct} />
            ))
          ) : (
            <p className="col-span-full text-center text-brand-400">Nenhum favorito selecionado ainda.</p>
          )}
        </div>
      </section>

      {/* ABOUT TEASER */}
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
              Arte feita com<br /><span className="font-script text-rose-500 text-5xl lg:text-6xl italic">carinho</span>
            </h2>
            <p className="mt-5 leading-relaxed text-brand-500">
              Trabalhamos com personalizados feitos à mão, com criatividade e acabamento de alta
              qualidade. Cada peça é única, pensada para emocionar quem recebe.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-brand-600">
              <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-rose-500" /> Atendimento personalizado</li>
              <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-rose-500" /> Produtos exclusivos</li>
              <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-rose-500" /> Qualidade premium e produção artesanal</li>
              <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-rose-500" /> Entrega para todo o Brasil</li>
            </ul>
            <Link to="/sobre" className="btn-primary mt-8">
              Nossa história <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container-page py-16">
        <div className="text-center">
          <span className="eyebrow">Avaliações</span>
          <h2 className="heading mt-2 text-brand-700">Quem comprou, amou</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.length > 0 ? reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-rose-500 text-rose-500" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-brand-500">
                "{r.comment}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-rose-100" />
                <span className="font-semibold text-brand-700">{r.name}</span>
              </div>
            </motion.div>
          )) : (
            <p className="col-span-full text-center text-brand-400">Carregando avaliações...</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-rose-100 via-cream-100 to-nude-100 px-8 py-16 text-center shadow-soft-lg sm:px-16">
          <DecorativeBg variant="subtle" />
          <div className="relative">
            <h2 className="heading text-brand-700">Vamos criar algo inesquecível?</h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-500">
              Fale com a gente pelo WhatsApp e transforme sua ideia em um presente único.
            </p>
            <a
              href={whatsappUrl('Olá! Quero criar um personalizado exclusivo.')}
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
