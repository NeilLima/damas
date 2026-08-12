// ============================================
// MultiplayerServices - Eventos/constantes do socket
// Multiplayer Online (Damas)
// ============================================

/** Eventos enviados pelo cliente ao servidor. */
export const MULTIPLAYER_SOCKET = {
  namespace: '/game',
  createRoom: 'game:create',
  joinRoom: 'game:join',
  makeMove: 'game:move',
  reset: 'game:reset',
  leave: 'game:leave',
  chooseColor: 'game:chooseColor',
  // Eventos recebidos do servidor
  roomCreated: 'room:created',
  roomJoined: 'room:joined',
  roomError: 'room:error',
  roomClosed: 'room:closed',
  roomColor: 'room:color',
  gameStart: 'game:start',
  moveMade: 'move:made',
  moveRejected: 'move:rejected',
  gameOver: 'game:over',
  playerDisconnected: 'player:disconnected',
} as const;

export type MultiplayerSocketEvent = (typeof MULTIPLAYER_SOCKET)[keyof typeof MULTIPLAYER_SOCKET];

/** Gera um nome de jogador para exibição na sala. */
export function buildPlayerName(baseName: string | null): string {
  if (baseName && baseName.trim()) return baseName.trim();
  return 'Jogador';
}
