import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/data/catalog';

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink('Olá! Vim pelo site da Paulo Arte Criativa.')}
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
