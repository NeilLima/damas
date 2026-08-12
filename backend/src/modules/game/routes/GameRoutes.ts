/* eslint-disable prettier/prettier */
// ============================================
// GameRoutes - Rotas/namespaces do jogo
// Multiplayer Online (Damas)
// ============================================

export const gameRoutes = {
  base: '/game',
  startGame: '/game/start',
  makeMove: '/game/move',
  validMoves: '/game/valid-moves',
  socketNamespace: '/game',
  createRoom: 'game:create',
  joinRoom: 'game:join',
  makeMoveEvent: 'game:move',
  reset: 'game:reset',
  leave: 'game:leave',
  chooseColor: 'game:chooseColor',
};
