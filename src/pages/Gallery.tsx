import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { fetchGallery, type GalleryRow } from '@/lib/api';

export default function Gallery() {
  const [images, setImages] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const activeImg = images.find((g) => g.id === active);

  useEffect(() => {
    fetchGallery()
      .then((data) => setImages(data))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-12">
      <div className="text-center">
        <span className="eyebrow">Galeria</span>
        <h1 className="heading mt-2 text-brand-700">Nossos trabalhos</h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-500">
          Uma coletânea dos personalizados que criamos com carinho. Toque em uma imagem para ver em
          tela cheia.
        </p>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
        </div>
      ) : (
        <div className="masonry mt-10">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              onClick={() => setActive(img.id)}
              className="group block w-full overflow-hidden rounded-3xl shadow-soft"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-900/90 p-4 backdrop-blur"
          >
            <button className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={activeImg.src}
              alt={activeImg.alt}
              className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain shadow-soft-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
