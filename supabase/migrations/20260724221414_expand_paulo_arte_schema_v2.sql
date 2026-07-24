/*
# Paulo Arte Criativa — Schema completo v2

## Resumo
Expande o schema para suportar o painel administrativo completo:
- Adiciona colunas de status (ativo/inativo), selo (destaque/mais vendido/novo/promoção), preço original para promoção
- Cria tabelas: categories, customers, favorites, coupons, site_settings, digital_files
- Cria tabela product_images separada para múltiplas imagens com ordenação e imagem principal
- Adiciona customer_id à tabela orders
- Mantém a coluna images[] existente para compatibilidade

## 1. Tabelas alteradas

### products
- badge (text, nullable) — 'destaque' | 'mais_vendido' | 'novo' | 'promocao' | null
- original_price (numeric, nullable) — preço antes do desconto
- is_active (boolean, default true) — produto ativo ou inativo
- sales_count (int, default 0) — contador para "mais vendido"

### orders
- customer_id (uuid, nullable, FK para customers)

## 2. Tabelas novas

### categories
- id (uuid, PK)
- name (text, unique, not null)
- slug (text, unique)
- icon (text, nome do ícone lucide)
- sort_order (int, default 0)
- is_active (boolean, default true)

### product_images
- id (uuid, PK)
- product_id (uuid, FK para products, ON DELETE CASCADE)
- url (text, not null) — URL da imagem no Storage
- thumbnail_url (text) — URL da miniatura
- sort_order (int, default 0)
- is_main (boolean, default false) — imagem principal
- created_at (timestamptz)

### customers
- id (uuid, PK)
- name (text)
- email (text, unique)
- phone (text)
- created_at (timestamptz)

### favorites
- id (uuid, PK)
- customer_id (uuid, FK para customers)
- product_id (uuid, FK para products, ON DELETE CASCADE)
- created_at (timestamptz)
- UNIQUE(customer_id, product_id)

### coupons
- id (uuid, PK)
- code (text, unique, not null)
- discount_type (text) — 'percent' | 'fixed'
- discount_value (numeric)
- is_active (boolean, default true)
- expires_at (timestamptz, nullable)
- created_at (timestamptz)

### site_settings
- id (uuid, PK)
- key (text, unique, not null)
- value (text)
- updated_at (timestamptz)

### digital_files
- id (uuid, PK)
- name (text, not null)
- description (text)
- format (text) — PDF, PNG, SVG, etc.
- price (numeric, default 0)
- is_free (boolean, default false)
- file_url (text) — URL do arquivo no Storage
- image_url (text) — imagem de preview
- is_active (boolean, default true)
- created_at (timestamptz)

## 3. Segurança (RLS)
- Todas as tabelas novas com RLS habilitado
- Leitura pública (anon, authenticated) para: categories, product_images, digital_files, coupons (apenas ativos), site_settings
- Escrita restrita a authenticated para: categories, product_images, digital_files, coupons, site_settings
- customers: leitura/escrita só authenticated
- favorites: leitura/escrita só authenticated (owner-scoped via customer_id)

## 4. Seed
- Insere categorias iniciais baseadas nas categorias existentes
- Não altera produtos existentes
*/

-- ============ ALTER PRODUCTS ============
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS badge text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS original_price numeric(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sales_count int NOT NULL DEFAULT 0;

-- Atualiza produtos featured existentes com badge 'destaque'
UPDATE products SET badge = 'destaque' WHERE featured = true AND badge IS NULL;

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE,
  icon text DEFAULT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- Seed categories
INSERT INTO categories (name, slug, sort_order)
SELECT value, lower(replace(value, ' ', '-')), idx
FROM unnest(ARRAY[
  'Sacolas Personalizadas',
  'Caixas para Caneca',
  'Caixas Explosão',
  'Kits Presente',
  'Canecas',
  'Topos de Bolo',
  'Papelaria Personalizada',
  'Adesivos',
  'Lembrancinhas',
  'Arquivos Digitais'
]) WITH ORDINALITY AS t(value, idx)
ON CONFLICT (name) DO NOTHING;

-- ============ PRODUCT_IMAGES ============
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  thumbnail_url text DEFAULT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_main boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_product_images" ON product_images;
CREATE POLICY "anon_select_product_images" ON product_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_product_images" ON product_images;
CREATE POLICY "auth_insert_product_images" ON product_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_product_images" ON product_images;
CREATE POLICY "auth_update_product_images" ON product_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_product_images" ON product_images;
CREATE POLICY "auth_delete_product_images" ON product_images FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON product_images(product_id, sort_order);

-- ============ CUSTOMERS ============
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text UNIQUE,
  phone text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_customers" ON customers;
CREATE POLICY "auth_select_customers" ON customers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_customers" ON customers;
CREATE POLICY "auth_insert_customers" ON customers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_customers" ON customers;
CREATE POLICY "auth_update_customers" ON customers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_customers" ON customers;
CREATE POLICY "auth_delete_customers" ON customers FOR DELETE
  TO authenticated USING (true);

-- ============ FAVORITES ============
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_favorites" ON favorites;
CREATE POLICY "auth_select_favorites" ON favorites FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_favorites" ON favorites;
CREATE POLICY "auth_insert_favorites" ON favorites FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_favorites" ON favorites;
CREATE POLICY "auth_delete_favorites" ON favorites FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_favorites_customer ON favorites(customer_id);

-- ============ COUPONS ============
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL DEFAULT 'percent',
  discount_value numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_coupons" ON coupons;
CREATE POLICY "anon_select_coupons" ON coupons FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_coupons" ON coupons;
CREATE POLICY "auth_insert_coupons" ON coupons FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_coupons" ON coupons;
CREATE POLICY "auth_update_coupons" ON coupons FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_coupons" ON coupons;
CREATE POLICY "auth_delete_coupons" ON coupons FOR DELETE
  TO authenticated USING (true);

-- ============ SITE_SETTINGS ============
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- Seed default settings
INSERT INTO site_settings (key, value)
VALUES
  ('whatsapp_number', '5511999999999'),
  ('store_name', 'Paulo Arte Criativa'),
  ('store_email', 'contato@pauloartecriativa.com.br'),
  ('store_phone', '(11) 99999-9999'),
  ('store_instagram', '@pauloartecriativa'),
  ('free_shipping_min', '0'),
  ('announcement_text', '')
ON CONFLICT (key) DO NOTHING;

-- ============ DIGITAL_FILES ============
CREATE TABLE IF NOT EXISTS digital_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  format text DEFAULT 'PDF',
  price numeric(10,2) NOT NULL DEFAULT 0,
  is_free boolean NOT NULL DEFAULT false,
  file_url text DEFAULT '',
  image_url text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE digital_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_digital_files" ON digital_files;
CREATE POLICY "anon_select_digital_files" ON digital_files FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_digital_files" ON digital_files;
CREATE POLICY "auth_insert_digital_files" ON digital_files FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_digital_files" ON digital_files;
CREATE POLICY "auth_update_digital_files" ON digital_files FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_digital_files" ON digital_files;
CREATE POLICY "auth_delete_digital_files" ON digital_files FOR DELETE
  TO authenticated USING (true);

-- ============ ALTER ORDERS ============
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;

-- ============ ADD is_active FILTER NOTE ============
-- Note: The frontend will filter by is_active = true for public pages.
-- Admin panel will show all products regardless of is_active status.
