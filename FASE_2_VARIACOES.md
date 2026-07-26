# Fase 2 — Produtos com opções e preços diferentes

Implementado nesta entrega:

- produto simples continua funcionando sem alterações;
- opção configurável por produto (Tamanho, Modelo, Capacidade etc.);
- várias opções, cada uma com seu próprio preço;
- seleção obrigatória na página do produto;
- carrinho separa o mesmo produto por opção escolhida;
- total calculado pelo preço da opção;
- mensagem do WhatsApp inclui opção, quantidade, valor unitário, subtotal e referência da imagem;
- migração Supabase sem apagar produtos existentes.

## Aplicar no Supabase

Execute o conteúdo de:

`supabase/migrations/20260725210000_add_product_variants.sql`

no SQL Editor do projeto Supabase antes de cadastrar produtos com opções.
