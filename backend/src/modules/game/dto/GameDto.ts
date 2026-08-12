/* eslint-disable prettier/prettier */
// ============================================
// DTOs do jogo - Multiplayer Online (Damas)
// ============================================
import { PlayerColor } from '../types/GameTypes';

export interface JoinRoomDto {
  roomId?: string;
  playerId: string;
  playerName?: string;
}

export interface MakeMoveDto {
  roomId: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

export interface ResetDto {
  roomId: string;
}

export interface ChooseColorDto {
  roomId: string;
  color: PlayerColor;
}

