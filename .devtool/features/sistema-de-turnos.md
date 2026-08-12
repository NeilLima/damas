---
id: "sistema-de-turnos"
status: "done"
priority: "high"
assignee: "victor"
epic: "gameplay-solo"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-12T01:08:37.441Z"
completedAt: "2026-08-12T01:08:37.441Z"
labels: [frontend]
order: "a20"
---
# Sistema de turnos

## Descrição
Controlar a alternância de turnos entre brancas e pretas, com indicador visual e bloqueio de interação no turno do oponente/IA.

## A fazer
- Criar `src/hooks/useGameState.ts` (estado global da partida)
- Criar `src/shared/game/utils/GameTurnUtils.tsx` (alternância/validação de vez)
- Indicador visual de turno em `shared/game/styles`
- Bloquear interação durante animação ou turno adversário

## Critério de aceite
O jogador só consegue mover peças da sua cor e somente na sua vez.