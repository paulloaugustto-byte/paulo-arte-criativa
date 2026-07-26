import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

const whatsappNumber = '5565998022115';

const whatsappLink = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-nude-200/60 bg-nude-100">
      <svg
        className="pointer-events-none absolute -right-10 -top-8 h-32 w-32 text-nude-300/40"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M50 10 L50 90"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <svg
        className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 text-rose-200/30"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M20 80 Q40 60 50 40 Q60 20 80 20"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <ellipse
          cx="35"
          cy="65"
          rx="6"
          ry="3"
          fill="currentColor"
          opacity="0.5"
          transform="rotate(-30 35 65)"
        />
        <ellipse
          cx="55"
          cy="45"
          rx="6"
          ry="3"
          fill="currentColor"
          opacity="0.5"
          transform="rotate(-30 55 45)"
        />
      </svg>

      <div className="container-page relative grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-paulo-arte-criativa.png"
              alt="Paulo Arte Criativa"
              className="h-16 w-16 shrink-0 rounded-full object-contain"
            />

            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-brand-700">
                Paulo Arte Criativa
              </span>

              <span className="font-script text-lg leading-none text-rose-500">
                Transformando papel em emoções
              </span>
            </span>
          </Link>

          <p className="mt-4 text-sm leading-relaxed text-brand-500">
            Transformando papel em emoções. Personalizados exclusivos com
            acabamento de alta qualidade.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="https://www.instagram.com/pauloartecriativa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Paulo Arte Criativa"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-500 shadow-soft transition-all hover:scale-110 hover:bg-rose-100 hover:text-rose-600"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <a
              href={whatsappLink(
                'Olá! Vim pelo site e gostaria de mais informações.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Paulo Arte Criativa"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-500 shadow-soft transition-all hover:scale-110 hover:bg-rose-100 hover:text-rose-600"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-brand-700">
            Navegação
          </h4>

          <ul className="mt-4 space-y-2.5 text-sm text-brand-500">
            <li>
              <Link
                to="/catalogo"
                className="transition-colors hover:text-rose-500"
              >
                Catálogo
              </Link>
            </li>

            <li>
              <Link
                to="/arquivos-digitais"
                className="transition-colors hover:text-rose-500"
              >
                Arquivos Digitais
              </Link>
            </li>

            <li>
              <Link
                to="/galeria"
                className="transition-colors hover:text-rose-500"
              >
                Galeria
              </Link>
            </li>

            <li>
              <Link
                to="/sobre"
                className="transition-colors hover:text-rose-500"
              >
                Quem Somos
              </Link>
            </li>

            <li>
              <Link
                to="/faq"
                className="transition-colors hover:text-rose-500"
              >
                Dúvidas Frequentes
              </Link>
            </li>

            <li>
              <Link
                to="/contato"
                className="transition-colors hover:text-rose-500"
              >
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-brand-700">
            Contato
          </h4>

          <ul className="mt-4 space-y-3 text-sm text-brand-500">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-rose-500" />

              <a
                href={whatsappLink('Olá!')}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-rose-500"
              >
                (65) 99802-2115
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-rose-500" />

              <a
                href="mailto:contato@pauloartecriativa.com.br"
                className="break-all transition-colors hover:text-rose-500"
              >
                contato@pauloartecriativa.com.br
              </a>
            </li>

            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />

              <span>
                Cuiabá, MT — Entrega para todo o Brasil
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-brand-700">
            Newsletter
          </h4>

          <p className="mt-4 text-sm text-brand-500">
            Receba novidades e promoções exclusivas.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              alert('Cadastro realizado! Obrigado.');
            }}
            className="mt-4 flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Seu e-mail"
              aria-label="Seu e-mail"
              className="input min-w-0 flex-1"
            />

            <button
              type="submit"
              className="btn-rose shrink-0"
            >
              Assinar
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-nude-200/60">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-brand-400 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} Paulo Arte Criativa. Todos os direitos
            reservados.
          </p>

          <p className="font-script text-sm text-rose-400">
            Feito com carinho no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}