/* eslint-disable prettier/prettier */
// ============================================
// GameLogs - Logs estruturados do jogo
// Multiplayer Online (Damas)
// ============================================

export type GameLogLevel = 'info' | 'warn' | 'error';

export function createGameLog(level: GameLogLevel, message: string): void {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '[ERRO]' : level === 'warn' ? '[AVISO]' : '[INFO]';
  // eslint-disable-next-line no-console
  console.log(`${timestamp} ${prefix} [Game] ${message}`);
}
