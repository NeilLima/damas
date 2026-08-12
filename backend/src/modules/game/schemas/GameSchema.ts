/* eslint-disable prettier/prettier */
// ============================================
// GameSchema - Documentação dos payloads do game loop (REST)
// Game Loop Backend (Damas)
// ============================================

export const gameSchema = {
  startGame: {
    request: {
      playerWhiteId: 'string',
      playerBlackId: 'string',
      type: 'BOT | PVP (opcional)',
    },
    response: {
      id: 'string',
      type: 'BOT | PVP',
      playerWhite: 'string',
      playerBlack: 'string',
      board: 'BoardCell[][]',
      turn: 'white | black',
      status: 'active | over',
      winner: 'white | black | null',
      createdAt: 'ISO string',
    },
  },
  makeMove: {
    request: {
      gameId: 'string',
      playerId: 'string',
      from: '{ row, col }',
      to: '{ row, col }',
    },
    response: {
      gameId: 'string',
      board: 'BoardCell[][]',
      turn: 'white | black',
      status: 'active | over',
      winner: 'white | black | null',
    },
  },
  validMoves: {
    query: {
      gameId: 'string',
      row: 'number',
      col: 'number',
    },
    response: 'BoardPosition[]',
  },
} as const;
