/*
# Paulo Arte Criativa — Schema inicial

## Resumo
Cria as tabelas do e-commerce de personalizados: produtos, galeria, depoimentos e pedidos.
Inclui RLS com leitura pública (anon) e escrita restrita a usuários autenticados (admin).

## 1. Tabelas novas

### products
- id (uuid, PK)
- name (text, not null)
- description (text)
- category (text, not null)
- commemorative (text[], datas comemorativas associadas)
- price (numeric, not null)
- images (text[], URLs de imagem)
- featured (boolean, default false)
- keywords (text[], termos de busca)
- created_at (timestamptz)
- updated_at (timestamptz)

### gallery
- id (uuid, PK)
- src (text, URL da imagem)
- alt (text, descrição)
- created_at (timestamptz)

### reviews
- id (uuid, PK)
- name (text, nome do cliente)
- avatar (text, URL do avatar)
- rating (int, 1-5)
- comment (text)
- created_at (timestamptz)

### orders
- id (uuid, PK)
- customer_name (text)
- customer_phone (text)
- items (jsonb, lista de itens)
- total (numeric)
- status (text, default 'novo')
- created_at (timestamptz)

## 2. Segurança (RLS)
- products: leitura pública (anon, authenticated); escrita só authenticated
- gallery: leitura pública; escrita só authenticated
- reviews: leitura pública; escrita só authenticated
- orders: leitura e escrita só authenticated

## 3. Seed
- Insere produtos iniciais, galeria e depoimentos.
*/

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  commemorative text[] NOT NULL DEFAULT '{}',
  price numeric(10,2) NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  keywords text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- ============ GALLERY ============
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  src text NOT NULL,
  alt text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery" ON gallery;
CREATE POLICY "anon_select_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (true);

-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_reviews" ON reviews;
CREATE POLICY "auth_insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_reviews" ON reviews;
CREATE POLICY "auth_update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (true);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL DEFAULT '',
  customer_phone text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]',
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_orders" ON orders;
CREATE POLICY "auth_select_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_orders" ON orders;
CREATE POLICY "auth_insert_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ============ SEED DATA ============

-- Seed products
INSERT INTO products (name, description, category, commemorative, price, images, featured, keywords)
VALUES
  ('Caixa Explosão Premium', 'Caixa explosão com acabamento luxuoso, surpresa ao abrir e espaço para fotos, cartas e mimos. O presente perfeito para emocionar quem você ama.', 'Caixas Explosão', ARRAY['Aniversário','Dia dos Namorados','Dia das Mães'], 89.90, ARRAY['https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], true, ARRAY['explosão','surpresa','romântico','luxo']),
  ('Sacola Personalizada Kraft', 'Sacola em papel kraft com estampa personalizada e alças de fita. Ideal para presentear com elegância e identidade própria.', 'Sacolas Personalizadas', ARRAY['Aniversário','Empresas','Casamento'], 12.90, ARRAY['https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], true, ARRAY['kraft','sacola','embalagem']),
  ('Caixa para Caneca MDF', 'Caixa em MDF revestida para caneca, com acabamento fosco e fechamento magnético. Encanta na hora da entrega.', 'Caixas para Caneca', ARRAY['Dia dos Pais','Dia das Mães','Professores'], 24.90, ARRAY['https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], true, ARRAY['caneca','mdf','presente']),
  ('Kit Presente Amor', 'Kit completo com caixa, caneca personalizada, chocolates e cartão. Montamos o presente dos sonhos para você.', 'Kits Presente', ARRAY['Dia dos Namorados','Aniversário','Dia das Mães'], 149.90, ARRAY['https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], true, ARRAY['kit','combo','amor','presente completo']),
  ('Caneca Mágica Personalizada', 'Caneca de cerâmica que revela a arte ao contato com líquido quente. Personalize com fotos, nomes e frases.', 'Canecas', ARRAY['Aniversário','Dia dos Pais','Professores'], 39.90, ARRAY['https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], false, ARRAY['mágica','cerâmica','fotografia']),
  ('Topo de Bolo Acrílico', 'Topo de bolo em acrílico com nome e tema personalizados. Toque final sofisticado para qualquer comemoração.', 'Topos de Bolo', ARRAY['Casamento','Aniversário','Chá de bebê'], 34.90, ARRAY['https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], false, ARRAY['topo','bolo','festa','acrílico']),
  ('Papelaria Personalizada Luxo', 'Bloco, agenda e cartões com identidade visual exclusiva. Papelaria sofisticada para marcar presença.', 'Papelaria Personalizada', ARRAY['Volta às aulas','Empresas'], 59.90, ARRAY['https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], false, ARRAY['agenda','bloco','cartão','escritório']),
  ('Adesivos Personalizados', 'Adesivos em vinil de alta durabilidade, resistentes à água. Personalize formatos, cores e artes.', 'Adesivos', ARRAY['Volta às aulas','Empresas','Aniversário'], 9.90, ARRAY['https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], false, ARRAY['vinil','sticker','rótulo']),
  ('Lembrancinha Chá de Bebê', 'Lembrancinhas delicadas para o seu chá de bebê, com embalagem personalizada e acabamento impecável.', 'Lembrancinhas', ARRAY['Chá de bebê'], 14.90, ARRAY['https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], false, ARRAY['bebê','lembrança','maternidade']),
  ('Convite Digital Personalizado', 'Arquivo digital de convite em alta resolução, pronto para impressão ou envio pelo WhatsApp. Personalização completa.', 'Arquivos Digitais', ARRAY['Casamento','Aniversário','Chá de bebê'], 29.90, ARRAY['https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], false, ARRAY['convite','digital','download','arquivo']),
  ('Caixa Explosão Natalina', 'Edição especial de Natal com temas festivos, luzes e mimos sazonais. A magia do Natal em cada detalhe.', 'Caixas Explosão', ARRAY['Natal'], 99.90, ARRAY['https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], false, ARRAY['natal','festivo','explosão']),
  ('Kit Volta às Aulas', 'Kit completo com etiquetas, cadernos personalizados e marca-páginas. Comece o ano letivo com estilo.', 'Kits Presente', ARRAY['Volta às aulas'], 49.90, ARRAY['https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop','https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop'], false, ARRAY['escola','etiqueta','caderno'])
ON CONFLICT DO NOTHING;

-- Seed gallery
INSERT INTO gallery (src, alt)
VALUES
  ('https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', 'Caixa explosão personalizada'),
  ('https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Sacola personalizada'),
  ('https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop', 'Kit presente elegante'),
  ('https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'Papelaria personalizada'),
  ('https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=600&h=500&fit=crop', 'Detalhe de acabamento'),
  ('https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', 'Caneca personalizada'),
  ('https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Topo de bolo'),
  ('https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop', 'Lembrancinha'),
  ('https://images.pexels.com/photos/4198104/pexels-4198104.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'Convite digital'),
  ('https://images.pexels.com/photos/6211168/pexels-6211168.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop', 'Caixa para caneca'),
  ('https://images.pexels.com/photos/6211175/pexels-6211175.jpeg?auto=compress&cs=tinysrgb&w=600&h=500&fit=crop', 'Adesivos personalizados'),
  ('https://images.pexels.com/photos/4498122/pexels-4498122.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'Papelaria luxo')
ON CONFLICT DO NOTHING;

-- Seed reviews
INSERT INTO reviews (name, avatar, rating, comment)
VALUES
  ('Mariana Souza', 'https://images.pexels.com/photos/4158296/pexels-4158296.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 5, 'A caixa explosão superou todas as expectativas! Minha mãe chorou ao abrir. Acabamento impecável e atendimento atencioso.'),
  ('Carlos Henrique', 'https://images.pexels.com/photos/220453/pexels-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 5, 'Encomendei kits para a equipe da empresa e foi um sucesso. Qualidade premium e entrega no prazo. Recomendo demais!'),
  ('Juliana Alves', 'https://images.pexels.com/photos/1239291/pexels-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 5, 'Cada detalhe é pensado com carinho. As lembrancinhas do meu chá de bebê ficaram um sonho. Obrigada Paulo Arte Criativa!'),
  ('Fernanda Lima', 'https://images.pexels.com/photos/733872/pexels-733872.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', 5, 'Profissionalismo do início ao fim. A caneca mágica foi o presente mais comentado do aniversário do meu pai.')
ON CONFLICT DO NOTHING;
