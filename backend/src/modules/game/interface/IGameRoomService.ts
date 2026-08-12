/* eslint-disable prettier/prettier */
// ============================================
// IGameRoomService - Contrato do serviço de salas
// Multiplayer Online (Damas)
// ============================================
import {
  BoardCell,
  BoardPosition,
  GameRoom,
  PlayerColor,
  RoomState,
} from '../types/GameTypes';

export interface IGameRoomService {
  initBoard(): BoardCell[][];
  createRoom(playerId: string, playerName?: string): GameRoom;
  joinRoom(roomId: string, playerId: string, playerName?: string): GameRoom;
  getRoom(roomId: string): GameRoom | undefined;
  removePlayer(roomId: string, playerId: string): GameRoom | undefined;
  toState(room: GameRoom): RoomState;
  makeMove(roomId: string, playerId: string, from: BoardPosition, to: BoardPosition): GameRoom | null;
  reset(roomId: string): GameRoom | undefined;
}

export type { GameRoom, PlayerColor, BoardPosition, RoomState };
