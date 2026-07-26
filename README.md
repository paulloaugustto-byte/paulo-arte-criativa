# Paulo Arte Criativa

Site em React, TypeScript, Vite e Tailwind CSS, com catálogo, carrinho, favoritos, login administrativo e integração com Supabase.

## Executar no computador

1. Instale o Node.js LTS.
2. Abra esta pasta no VS Code.
3. No terminal, execute:

```bash
npm install
npm run dev
```

O endereço local será mostrado no terminal, normalmente `http://localhost:5173`.

## Configurar o Supabase

Copie `.env.example` para `.env` e preencha as duas variáveis com os dados do seu projeto Supabase.

## Verificações

```bash
npm run typecheck
npm run lint
npm run build
```

## Publicação

O projeto contém `vercel.json` e pode ser publicado na Vercel. Antes de publicar, cadastre no painel da hospedagem as mesmas variáveis do arquivo `.env`.
