---
id: "game-loop-backend"
status: "backlog"
priority: "high"
assignee: "victor"
epic: "multiplayer"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-11T22:05:00.000Z"
completedAt: null
labels: [backend]
order: "a40"
---
# Game Loop no Backend (GameModule)

## Descrição
Criar o módulo `src/modules/game/` (ainda não existe). Toda regra de validação de movimento deve ficar no backend.

## A fazer
- `src/modules/game/game.module.ts`
- `controllers/GameController.ts` (POST /move, GET /valid-moves, POST /start-game)
- `services/GameService.ts` (validação, captura, promoção, captura múltipla)
- `repository/GameRepository.ts` (persistência de partidas/movimentos)
- `dto/MoveDto.ts`, `StartGameDto.ts`
- `schemas/GameSchema.ts`, `interface/IGameService.ts`, `types/GameTypes.ts`, `logs/GameLogs.ts`, `routes/GameRoutes.ts`

## Critério de aceite
Backend valida jogadas e persiste partidas/movimentos no banco.