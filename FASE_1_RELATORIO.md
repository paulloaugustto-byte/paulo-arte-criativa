# Fase 1 — Estrutura e estabilidade

## Correções aplicadas

- O `SiteSettingsProvider` foi conectado à árvore principal da aplicação.
- Rotas inexistentes agora redirecionam para a página inicial.
- Carrinho e favoritos não derrubam mais o site quando o armazenamento local contém dados inválidos.
- A inicialização da autenticação trata falhas sem deixar a aplicação carregando indefinidamente.
- O carregamento das configurações do site trata indisponibilidade do Supabase sem quebrar a página.
- A imagem quebrada da seção “Quem Somos” foi substituída por uma URL funcional.
- Imports e propriedades não utilizados foram removidos.
- Foi incluído `.env.example` e documentação de instalação e publicação.

## Validações executadas

- `npm run typecheck`: aprovado, sem erros.
- `npm run lint`: aprovado, sem erros; apenas 4 avisos conhecidos do Fast Refresh em arquivos de contexto.
- `npm run build`: não pôde ser concluído neste ambiente porque o `node_modules` exportado foi instalado no Windows e não contém o binário opcional do Rollup para Linux. No Windows, execute `npm install` antes de `npm run build`.

## Preservação

Nenhum produto, página, texto, configuração do Supabase, migração ou funcionalidade comercial foi removido. A pasta `node_modules` não faz parte do pacote final porque deve ser recriada no computador com `npm install`.
