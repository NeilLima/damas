// ============================================
// Tipos do Multiplayer Online (Damas)
// ============================================
import type { BoardCell, BoardPosition, CellValue } from '../../board/types/BoardTypes';

export type PlayerColor = 'white' | 'black';

export type MultiplayerPhase = 'menu' | 'waiting' | 'playing' | 'over';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  color: PlayerColor;
}

export interface MultiplayerStatePayload {
  board: BoardCell[][];
  turn: PlayerColor;
}

export interface RoomCreatedPayload {
  roomId: string;
  playerId: string;
  color: PlayerColor;
  state: MultiplayerStatePayload;
}

export interface RoomJoinedPayload {
  roomId: string;
  playerId: string;
  color: PlayerColor;
  state: MultiplayerStatePayload;
}

export interface GameStartPayload {
  roomId: string;
  state: MultiplayerStatePayload;
  players: MultiplayerPlayer[];
}

export interface MoveMadePayload {
  roomId: string;
  state: MultiplayerStatePayload;
  lastMove: { from: BoardPosition; to: BoardPosition } | null;
}

export interface GameOverPayload {
  roomId: string;
  winner: PlayerColor | null;
  state: MultiplayerStatePayload;
}

export interface MultiplayerState {
  phase: MultiplayerPhase;
  roomId: string | null;
  myColor: PlayerColor | null;
  myId: string | null;
  board: BoardCell[][] | null;
  turn: PlayerColor | null;
  winner: PlayerColor | null;
  connected: boolean;
  error: string | null;
}

export interface MultiplayerActions {
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  makeMove: (from: BoardPosition, to: BoardPosition) => void;
  reset: () => void;
  leaveRoom: () => void;
}

export interface MultiplayerReturn {
  state: MultiplayerState;
  actions: MultiplayerActions;
}

export interface MultiplayerRenderInfo {
  cellBg: (row: number, col: number) => string;
  pieceColor: (value: CellValue) => PlayerColor | null;
  isKing: (value: CellValue) => boolean;
}
