import { useEffect, useState } from 'react';
import { Download, FileText, ShoppingBag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { whatsappLink } from '@/data/catalog';
import { fetchDigitalFiles, type DigitalFileRow } from '@/lib/api';

export default function DigitalFiles() {
  const [files, setFiles] = useState<DigitalFileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDigitalFiles()
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-12">
      <div className="text-center">
        <span className="eyebrow">Arquivos Digitais</span>
        <h1 className="heading mt-2 text-brand-700">Baixe e compre artes digitais</h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-500">
          Convites, kits e calendários em alta resolução. Compre com um clique ou baixe os arquivos
          gratuitos.
        </p>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="card overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={file.image_url} alt={file.name} loading="lazy" className="h-full w-full object-cover" />
                {file.is_free && (
                  <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                    Grátis
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-brand-400">
                  <FileText className="h-4 w-4" />
                  {file.format}
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold text-brand-700">{file.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-500">{file.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-2xl font-semibold text-brand-700">
                    {file.is_free ? 'Grátis' : `R$ ${file.price.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                <div className="mt-4">
                  {file.is_free ? (
                    <button className="btn-primary w-full">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <a
                        href={whatsappLink(`Olá! Quero comprar o arquivo digital "${file.name}".`)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-rose flex-1"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Comprar
                      </a>
                      <button className="btn-outline px-4" disabled>
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
