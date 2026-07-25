import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function WhatsAppFloat() {
  const { settings } = useSiteSettings();

  const phone = settings.whatsapp_number;

  if (!phone) return null;

  const message = encodeURIComponent(
    'Olá! Vim pelo site da Paulo Arte Criativa.'
  );

  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-soft-lg transition-transform hover:scale-110 hover:bg-rose-400"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute inset-0 animate-ping rounded-full bg-rose-500 opacity-20" />
    </a>
  );
}