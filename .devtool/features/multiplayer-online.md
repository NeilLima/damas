---
id: "multiplayer-online"
status: "done"
priority: "high"
assignee: "victor"
epic: "multiplayer"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-12T01:08:37.441Z"
completedAt: "2026-08-12T01:08:37.441Z"
labels: [backend, websockets, frontend]
order: "a30"
---
# Multiplayer Online (usuários criados)

## Descrição
Jogar partidas online contra outros usuários criados/cadastrados, com sincronização em tempo real.

## A fazer
- WebSockets (Socket.io): instalar `@nestjs/websockets`, `platform-socket.io`, `socket.io-client`
- Criar `src/modules/game/gateway/GameGateway.ts` (`joinRoom`, `makeMove`, `gameOver`)
- Salas de jogo por partida + tratamento de desconexão/reconexão
- `src/hooks/useWebSocket.ts` no frontend
- Rota `/multiplayer` (criar/entrar em sala) e tela de menu adaptada
- Depende de: autenticação, `Game` no banco, game loop backend

## Critério de aceite
Dois usuários logados jogam uma partida em tempo real com as jogadas sincronizadas.