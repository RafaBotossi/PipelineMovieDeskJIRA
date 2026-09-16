# Pipeline de Atendimento — Protótipo Visual

🔗 **Demo publicada:** https://rafabotossi.github.io/PipelineMovieDeskJIRA/

Protótipo **somente visual** do portal de acompanhamento de pipeline de atendimento (Movidesk + Jira), descrito em [`spec.md`](spec.md).

Este protótipo **não possui backend, banco de dados, autenticação ou integrações reais** com Movidesk/Jira. Todos os 100 tickets exibidos são gerados por uma fixture determinística em [`frontend/src/data/mockTickets.ts`](frontend/src/data/mockTickets.ts), com títulos, tipos (bug/melhoria), status, resumos e relações com Jira variados — incluindo casos sem Jira, com 1, 2 ou 3 tickets Jira associados, e status Jira não mapeados. Não há tela de login: o app abre direto na tela "Pipeline de Atendimento".

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router (rotas client-side, incluindo `/public/t/:token` simulando o link público)

## Estrutura

```
frontend/
  src/
    config/pipelineConfig.ts   # mapeamento status Jira -> etapa do pipeline
    services/pipelineService.ts# regra de cálculo do pipeline (fora dos componentes)
    services/shareLinkService.ts
    data/mockTickets.ts        # fixture com os 100 tickets fictícios
    context/                   # estado de links de compartilhamento (mock) e toasts
    components/                # TicketTable, PipelineStepper, ShareTicketModal, etc.
    pages/                     # PipelinePage, TicketDetailPage, PublicTicketPage
  dist/                        # build de produção já gerado
```

## Rodando localmente

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Build

```bash
cd frontend
npm run build
```

O resultado fica em `frontend/dist` (já incluído neste repositório para visualização rápida, ex.: `npx serve frontend/dist`).

## Deploy (GitHub Pages)

O site publicado em https://rafabotossi.github.io/PipelineMovieDeskJIRA/ é servido a partir do branch `gh-pages`, que contém apenas o conteúdo de `frontend/dist` (gerado via `git subtree split --prefix frontend/dist -b gh-pages`). Para atualizar o deploy após novas mudanças:

```bash
cd frontend && npm run build && cd ..
git add frontend/dist && git commit -m "Atualiza build"
git push origin main
git branch -D gh-pages
git subtree split --prefix frontend/dist -b gh-pages
git push origin gh-pages --force
```

O `vite.config.ts` usa `base: "/PipelineMovieDeskJIRA/"` apenas em build de produção (o dev local continua na raiz), e o `BrowserRouter` usa esse mesmo `base` como `basename`. O arquivo `frontend/dist/404.html` (cópia do `index.html`) permite que rotas profundas (ex.: `/tickets/100005`, `/public/t/<token>`) funcionem diretamente no GitHub Pages.

## O que já está simulado

- Listagem dos 100 tickets com busca e filtros combináveis (status Movidesk, etapa do pipeline, com/sem Jira).
- Pipeline visual (stepper) por desenvolvimento Jira, com múltiplas linhas quando há mais de um Jira associado.
- Tela de detalhes do ticket com informações Movidesk e desenvolvimentos relacionados.
- Geração/cópia/revogação de link de acompanhamento público (`/public/t/<token>`), com token e persistência simulados no `localStorage` do navegador — não há backend real emitindo ou validando esses tokens.

## Próximos passos (fora do escopo deste protótipo)

Autenticação real, persistência em PostgreSQL, sincronização com Movidesk/Jira e as demais regras descritas em `spec.md`.
