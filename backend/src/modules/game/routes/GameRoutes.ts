/* eslint-disable prettier/prettier */
// ============================================
// GameRoutes - Rotas/namespaces do jogo
// Multiplayer Online (Damas)
// ============================================

export const gameRoutes = {
  base: '/',
  socketNamespace: '/game',
  createRoom: 'game:create',
  joinRoom: 'game:join',
  makeMove: 'game:move',
  reset: 'game:reset',
  leave: 'game:leave',
  chooseColor: 'game:chooseColor',
};
