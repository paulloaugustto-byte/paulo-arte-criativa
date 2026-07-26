import { useEffect, useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { whatsappLink } from '@/data/catalog';
import { fetchReviews, type ReviewRow } from '@/lib/api';
import { motion } from 'framer-motion';

export default function Contact() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  useEffect(() => { fetchReviews().then(setReviews).catch(() => {}); }, []);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="container-page py-12">
      <div className="text-center">
        <span className="eyebrow">Contato</span>
        <h1 className="heading mt-2 text-brand-700">Vamos conversar</h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-500">
          Estamos prontos para criar algo especial com você. Escolha o melhor canal para falar com a
          gente.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* INFO */}
        <div className="space-y-4">
          <a
            href={whatsappLink('Olá! Vim pelo site.')}
            target="_blank"
            rel="noreferrer"
            className="card flex items-center gap-4 p-6 transition-transform hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-brand-700">WhatsApp</p>
              <p className="text-sm text-brand-500">(65) 99802-2115</p>
            </div>
          </a>

          <a href="mailto:contato@pauloartecriativa.com.br" className="card flex items-center gap-4 p-6 transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-brand-700">E-mail</p>
              <p className="text-sm text-brand-500">contato@pauloartecriativa.com.br</p>
            </div>
          </a>

          <a  href="https://www.instagram.com/pauloartecriativa/" target="_blank" rel="noreferrer" className="card flex items-center gap-4 p-6 transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-brand-700">Instagram</p>
              <p className="text-sm text-brand-500">@pauloartecriativa</p>
            </div>
          </a>

          <div className="card overflow-hidden p-0">
            <div className="flex items-center gap-3 p-6 pb-3">
              <MapPin className="h-5 w-5 text-rose-500" />
              <p className="font-display text-lg font-semibold text-brand-700">Onde estamos</p>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-b-3xl">
              <iframe
                title="Mapa"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-46.7%2C-23.7%2C-46.5%2C-23.5&layer=mapnik"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="card p-8">
          <h2 className="font-display text-2xl font-semibold text-brand-700">
            Envie uma mensagem
          </h2>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-600">Nome</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-600">E-mail</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-600">Mensagem</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input resize-none"
                placeholder="Conte sua ideia..."
              />
            </div>
            <button type="submit" className="btn-rose w-full">
              <Send className="h-4 w-4" />
              Enviar mensagem
            </button>
            {sent && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-rose-100 px-4 py-3 text-center text-sm text-rose-700"
              >
                Mensagem enviada! Retornaremos em breve.
              </motion.p>
            )}
          </form>
        </div>
      </div>

      {/* REVIEWS */}
      <section className="mt-20">
        <div className="text-center">
          <span className="eyebrow">Avaliações</span>
          <h2 className="heading mt-2 text-brand-700">O que dizem nossos clientes</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-rose-500">★</span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-500">"{r.comment}"</p>
              <div className="mt-4 flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                <span className="font-medium text-brand-700">{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
