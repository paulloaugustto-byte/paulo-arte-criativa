import { motion } from 'framer-motion';
import { Award, Heart, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { whatsappLink } from '@/data/catalog';

const img = (id: number, w = 800, h = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

const pillars = [
  {
    icon: Heart,
    title: 'Atendimento personalizado',
    desc: 'Cada projeto começa com uma conversa. Ouvimos sua ideia e transformamos em realidade.',
  },
  {
    icon: Sparkles,
    title: 'Produtos exclusivos',
    desc: 'Nada é genérico. Cada peça é única, pensada para emocionar quem recebe.',
  },
  {
    icon: Award,
    title: 'Qualidade premium',
    desc: 'Materiais selecionados e acabamento impecável em cada detalhe.',
  },
  {
    icon: Truck,
    title: 'Entrega para todo o Brasil',
    desc: 'Enviamos para todo o território nacional com segurança e cuidado.',
  },
];

export default function About() {
  return (
    <div>
      <section className="container-page py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="eyebrow">Quem Somos</span>
            <h1 className="heading mt-3 text-brand-700">
              Arte que<br />emociona
            </h1>
            <p className="mt-6 leading-relaxed text-brand-500">
              A Paulo Arte Criativa nasceu do amor por transformar materiais simples em memórias
              afetivas. Acreditamos que um presente vai muito além do objeto: ele carrega afeto,
              cuidado e história.
            </p>
            <p className="mt-4 leading-relaxed text-brand-500">
              Cada peça é feita à mão, com criatividade e acabamento de alta qualidade. Do primeiro
              esboço à entrega, acompanhamos cada detalhe para garantir que sua lembrança seja
              verdadeiramente inesquecível.
            </p>
            <a
              href={whatsappLink('Olá! Conheci a Paulo Arte Criativa e quero saber mais.')}
              target="_blank"
              rel="noreferrer"
              className="btn-rose mt-8"
            >
              Vamos conversar
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <img src={img(4198104)} alt="Atelier" className="aspect-[3/4] w-full rounded-4xl object-cover shadow-soft" />
            <img src={img(4498122)} alt="Detalhe" className="mt-8 aspect-[3/4] w-full rounded-4xl object-cover shadow-soft" />
          </motion.div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-brand-700">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-500">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-4xl bg-gradient-to-br from-rose-100 via-cream-100 to-nude-100 px-8 py-14 text-center shadow-soft-lg sm:px-16">
          <h2 className="heading">Pronta para criar com a gente?</h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-500">
            Conte sua ideia e nós cuidamos de cada detalhe. Personalizados que emocionam, do papel
            à entrega.
          </p>
          <Link to="/catalogo" className="btn-rose mt-8">Ver catálogo</Link>
        </div>
      </section>
    </div>
  );
}
