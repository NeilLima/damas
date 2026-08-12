---
id: "banco-de-dados-prisma"
status: "done"
priority: "high"
assignee: "victor"
epic: "multiplayer"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-12T01:08:37.441Z"
completedAt: "2026-08-12T01:08:37.441Z"
labels: [backend, prisma, supabase]
order: "a50"
---
# Banco de Dados / Prisma (modelos do jogo)

## Descrição
O schema atual tem `User` + ~90 modelos de rede social, mas **falta os modelos de jogo**. Preparar as tabelas no Supabase (banco `postgres`).

## A fazer
- Adicionar `Game` (id, player1Id, player2Id, type[BOT|PVP], status, winnerId, boardStateJson, timestamps)
- Adicionar `Move` (id, gameId, playerId, fromRow, fromCol, toRow, toCol, capturedPiece, isKingPromotion, createdAt)
- Adicionar `PlayerGameStats` (id, userId, wins, losses, draws, rating)
- Adicionar modelos de multiplayer (convites/fila) quando escalar
- Executar `npx prisma db push` (ou `migrate dev`) para criar as tabelas

## Nota
Supabase usa um único banco `postgres` — criar `damas_db` separado NÃO é o padrão. A conexão pooler `us-west-2` já está configurada e testada no `.env` do backend.

## Critério de aceite
`npx prisma db push` cria as tabelas `Game`, `Move`, `PlayerGameStats` no Supabase.