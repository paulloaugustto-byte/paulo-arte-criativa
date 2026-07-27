import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

const fallbackWhatsApp = '5565998022115';

export default function WhatsAppFloat() {
  const { settings } = useSiteSettings();

  const phone = (
    settings?.whatsapp_number || fallbackWhatsApp
  ).replace(/\D/g, '');

  const message = encodeURIComponent(
    'Olá! Vim pelo site da Paulo Arte Criativa e gostaria de mais informações.',
  );

  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Paulo Arte Criativa pelo WhatsApp"
      title="Fale conosco pelo WhatsApp"
      className="group fixed bottom-6 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_10px_28px_rgba(34,197,94,0.32)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-200 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-500 opacity-20 sm:hidden" />

      <MessageCircle className="h-6 w-6 shrink-0 sm:h-5 sm:w-5" />

      <span className="hidden text-sm font-semibold sm:inline">
        WhatsApp
      </span>
    </a>
  );
}