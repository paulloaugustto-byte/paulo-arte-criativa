import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/data/catalog';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="container-page py-12">
      <div className="text-center">
        <span className="eyebrow">Dúvidas</span>
        <h1 className="heading mt-2 text-brand-700">Perguntas frequentes</h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-500">
          Tudo o que você precisa saber antes de encomendar. Não encontrou? Fale com a gente.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((item, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-6 text-left"
            >
              <span className="font-display text-lg font-semibold text-brand-700">
                {item.q}
              </span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="h-5 w-5 shrink-0 text-rose-500" />
              </motion.div>
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 leading-relaxed text-brand-500">{item.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
