---
id: "historico-partidas"
status: "backlog"
priority: "medium"
assignee: "victor"
epic: "gameplay-solo"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-11T22:05:00.000Z"
completedAt: null
labels: [frontend, history]
order: "a70"
---
# Tela de Histórico de Partidas

## Descrição
Criar `src/shared/history/` (pasta vazia). Listar partidas anteriores do usuário com resultado, data e oponente, com replay dos movimentos.

## A fazer
- `components/HistoryComp.tsx`
- `utils/HistoryUtils.tsx` (formatação de dados, filtros)
- `services/HistoryServices.tsx` (useQuery listando partidas)
- `types/HistoryTypes.tsx`, `styles/HistoryStyles.tsx`, `routes/HistoryRoutes.tsx`, `test/HistoryComp.test.tsx`
- Replay dos movimentos (usa dados de `Move`)

## Critério de aceite
Tela `/history` lista as partidas do usuário e permite rever as jogadas.