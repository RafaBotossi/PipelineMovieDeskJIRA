# Pipeline de Atendimento — Protótipo Visual

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

## O que já está simulado

- Listagem dos 100 tickets com busca e filtros combináveis (status Movidesk, etapa do pipeline, com/sem Jira).
- Pipeline visual (stepper) por desenvolvimento Jira, com múltiplas linhas quando há mais de um Jira associado.
- Tela de detalhes do ticket com informações Movidesk e desenvolvimentos relacionados.
- Geração/cópia/revogação de link de acompanhamento público (`/public/t/<token>`), com token e persistência simulados no `localStorage` do navegador — não há backend real emitindo ou validando esses tokens.

## Próximos passos (fora do escopo deste protótipo)

Autenticação real, persistência em PostgreSQL, sincronização com Movidesk/Jira e as demais regras descritas em `spec.md`.
