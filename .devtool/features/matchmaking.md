---
id: "matchmaking"
status: "backlog"
priority: "medium"
assignee: "victor"
epic: "multiplayer"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-11T22:05:00.000Z"
completedAt: null
labels: [backend, websockets]
order: "a100"
---
# Matchmaking (fila de espera)

## Descrição
Fila de espera com emparelhamento automático de jogadores online por rating.

## A fazer
- `services/MatchmakingService.ts` + fila em memória
- Emparelhamento por nível/rating
- Notificar ambos via WebSocket quando oponente encontrado
- `dto/MatchmakingDto.ts`
- Status da fila na tela de menu

## Critério de aceite
Dois jogadores na fila são emparelhados automaticamente e a partida inicia.