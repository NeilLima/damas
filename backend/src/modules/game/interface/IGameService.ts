/* eslint-disable prettier/prettier */
// ============================================
// IGameService - Contrato do game loop (REST)
// Game Loop Backend (Damas)
// ============================================
import { MoveDto, StartGameDto, ValidMovesDto } from '../dto/GameDto';
import { BoardPosition, GameStatePayload, OngoingGame } from '../types/GameTypes';

export interface IGameService {
  startGame(dto: StartGameDto): OngoingGame;
  makeMove(dto: MoveDto): GameStatePayload;
  getValidMoves(dto: ValidMovesDto): BoardPosition[];
}
