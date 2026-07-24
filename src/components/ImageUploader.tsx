import { useCallback, useRef, useState } from 'react';
import { Upload, X, GripVertical, Star, Loader2, ImagePlus } from 'lucide-react';
import { uploadProductImage, deleteStorageImage } from '@/lib/api';

export interface UploadedImage {
  url: string;
  thumbnailUrl: string;
  isMain: boolean;
}

interface ImageUploaderProps {
  productId: string;
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ productId, images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const newImages: UploadedImage[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        // Compress image client-side before upload
        const compressed = await compressImage(file, 1200, 0.82);
        const { url, thumbnailUrl } = await uploadProductImage(compressed, productId);
        newImages.push({
          url,
          thumbnailUrl,
          isMain: images.length === 0 && newImages.length === 0,
        });
      }
      const updated = [...images, ...newImages];
      // Ensure exactly one main image
      if (!updated.some((img) => img.isMain) && updated.length > 0) {
        updated[0].isMain = true;
      }
      onChange(updated);
    } catch (err) {
      alert('Erro ao enviar imagem: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }, [images, productId, onChange]);

  const compressImage = async (file: File, maxDim: number, quality: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            const compressed = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(compressed);
          },
          'image/jpeg',
          quality,
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Falha ao processar imagem')); };
      img.src = url;
    });
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    await deleteStorageImage(img.url);
    const updated = images.filter((_, i) => i !== index);
    if (img.isMain && updated.length > 0) updated[0].isMain = true;
    onChange(updated);
  };

  const setMain = (index: number) => {
    const updated = images.map((img, i) => ({ ...img, isMain: i === index }));
    onChange(updated);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-brand-600">Imagens do produto</label>

      {/* DROP ZONE */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? 'border-rose-500 bg-rose-50' : 'border-nude-300 hover:border-rose-300 hover:bg-nude-50'
        }`}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
        ) : (
          <ImagePlus className="h-8 w-8 text-brand-400" />
        )}
        <p className="mt-3 text-sm text-brand-500">
          {uploading ? 'Enviando...' : 'Arraste imagens aqui ou clique para selecionar'}
        </p>
        <p className="mt-1 text-xs text-brand-400">Compressão automática. Você pode selecionar várias.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {/* IMAGE GRID */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIndex !== null) moveImage(dragIndex, i); setDragIndex(null); }}
              className={`group relative overflow-hidden rounded-2xl border-2 ${
                img.isMain ? 'border-rose-500' : 'border-nude-200'
              }`}
            >
              <img src={img.thumbnailUrl || img.url} alt={`Imagem ${i + 1}`} className="aspect-square w-full object-cover" />

              {/* MAIN BADGE */}
              {img.isMain && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white">
                  <Star className="h-3 w-3 fill-current" /> Principal
                </span>
              )}

              {/* ACTIONS */}
              <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setMain(i)}
                  className="rounded-full bg-white/90 p-2 text-brand-600 hover:bg-white"
                  title="Definir como principal"
                >
                  <Star className={`h-4 w-4 ${img.isMain ? 'fill-current text-rose-500' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="rounded-full bg-white/90 p-2 text-rose-500 hover:bg-white"
                  title="Excluir"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* DRAG HANDLE */}
              <div className="absolute right-2 top-2 cursor-grab rounded-full bg-white/80 p-1 text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="mt-2 text-xs text-brand-400">
          Arraste para reordenar. A imagem marcada com estrela é a principal.
        </p>
      )}
    </div>
  );
}
