---
id: "ia-computador-damas-auto"
status: "backlog"
priority: "high"
assignee: "victor"
epic: "gameplay-solo"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-11T22:05:00.000Z"
completedAt: null
labels: [frontend, ia, bug]
order: "a10"
---
# IA Computador (Damas Automáticas)

## Problema (bug reportado)
O modo "Jogar vs Computador" (`/game`) renderiza `Board3DComp`, mas **não há IA nem sistema de turnos** — o usuário move manualmente as duas cores. O computador não joga sozinho.

## A fazer
- Implementar controle de turnos no frontend (`src/hooks/useGameState.ts`)
- Implementar algoritmo Minimax + poda alfa-beta (níveis: fácil=prof2, médio=prof4, difícil=prof6)
- Endpoint `POST /game/ai-move` no `GameController`
- Bloquear interação do jogador quando for a vez da IA
- Travar o tabuleiro contra mover peças do oponente
- Indicador visual de "computador pensando..."

## Critério de aceite
Ao clicar em "Jogar vs Computador", o oponente automático responde sozinho com movimentos válidos.