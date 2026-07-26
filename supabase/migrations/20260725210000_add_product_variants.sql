-- Fase 2: opções/variações de produtos.
-- Mantém todos os produtos existentes compatíveis: sem opções = preço simples.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS option_name text,
  ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN products.option_name IS 'Nome da opção exibida ao cliente, como Tamanho, Modelo ou Capacidade.';
COMMENT ON COLUMN products.variants IS 'Lista de opções no formato [{id, name, price, is_active}].';

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_variants_is_array;

ALTER TABLE products
  ADD CONSTRAINT products_variants_is_array
  CHECK (jsonb_typeof(variants) = 'array');
