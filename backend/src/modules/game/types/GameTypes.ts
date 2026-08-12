/* eslint-disable prettier/prettier */
// ============================================
// Tipos do jogo de Damas - Backend (Multiplayer)
// Feature IA Computador / Multiplayer Online
// ============================================

export type CellValue = null | 'white' | 'black' | 'white-king' | 'black-king';

export type PlayerColor = 'white' | 'black';

export interface BoardPosition {
  row: number;
  col: number;
}

export interface BoardCell {
  position: BoardPosition;
  value: CellValue;
  isPlayable: boolean;
}

export interface RoomPlayer {
  id: string;
  name: string;
  color: PlayerColor;
}

export interface LastMove {
  from: BoardPosition;
  to: BoardPosition;
}

export interface RoomState {
  board: BoardCell[][];
  turn: PlayerColor;
}

export interface GameRoom {
  id: string;
  players: RoomPlayer[];
  board: BoardCell[][];
  turn: PlayerColor;
  status: 'waiting' | 'playing' | 'over';
  winner: PlayerColor | null;
  lastMove: LastMove | null;
}
