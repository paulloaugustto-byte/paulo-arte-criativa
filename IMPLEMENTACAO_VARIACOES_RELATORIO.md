# Implementação de produtos com variações

## Implementado

- Produto simples ou produto com opções.
- Nome configurável da opção, como Tamanho, Modelo ou Capacidade.
- Várias opções com preço próprio.
- Preço base calculado automaticamente pela opção ativa mais barata.
- Validação de nomes duplicados e opções inválidas.
- Seleção obrigatória da opção na página do produto.
- Carrinho separando o mesmo produto por opção.
- Quantidade, valor unitário e subtotal por opção.
- Mensagem do WhatsApp com opção, quantidade e preço.
- Compatibilidade com produtos antigos sem opções.
- Normalização defensiva de dados vindos do Supabase.
- Imagem substituta para produtos sem foto.
- Recuperação segura de carrinho antigo salvo no navegador.

## Banco de dados

A migração já aplicada é:

`supabase/migrations/20260725210000_add_product_variants.sql`

Ela adiciona `option_name` e `variants` à tabela `products` sem apagar dados existentes.

## Validação técnica

- TypeScript: aprovado (`npm run typecheck`).
- ESLint: zero erros; quatro avisos antigos de Fast Refresh nos contexts.
- O build Vite não foi executado neste ambiente Linux porque o `node_modules` disponível veio de Windows e não contém o binário opcional Linux do Rollup. No Windows, execute `npm install` e `npm run build` para a validação final.
