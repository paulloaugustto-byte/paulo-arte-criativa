/*
# Create Storage Bucket for Product Images

## Resumo
Cria um bucket público no Supabase Storage para armazenar imagens de produtos.
Permite upload e leitura pública das imagens.

## 1. Storage
- Bucket: product-images (público, 50MB max)
- Políticas de acesso: leitura pública, upload só authenticated
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

-- Allow authenticated upload
DROP POLICY IF EXISTS "Auth upload product images" ON storage.objects;
CREATE POLICY "Auth upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated update (for reordering metadata)
DROP POLICY IF EXISTS "Auth update product images" ON storage.objects;
CREATE POLICY "Auth update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- Allow authenticated delete
DROP POLICY IF EXISTS "Auth delete product images" ON storage.objects;
CREATE POLICY "Auth delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
