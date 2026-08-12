/* eslint-disable prettier/prettier */
// ============================================
// GameController - Game Loop (REST)
// Endpoints: POST /game/start, POST /game/move, GET /game/valid-moves
// ============================================
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GameService } from '../services/GameService';
import { MoveDto, StartGameDto, ValidMovesDto } from '../dto/GameDto';
import { BoardPosition, GameStatePayload, OngoingGame } from '../types/GameTypes';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  public startGame(@Body() dto: StartGameDto): OngoingGame {
    return this.gameService.startGame(dto);
  }

  @Post('move')
  public makeMove(@Body() dto: MoveDto): GameStatePayload {
    return this.gameService.makeMove(dto);
  }

  @Get('valid-moves')
  public getValidMoves(
    @Query('gameId') gameId: string,
    @Query('row') row: string,
    @Query('col') col: string,
  ): BoardPosition[] {
    return this.gameService.getValidMoves({
      gameId,
      row: parseInt(row, 10),
      col: parseInt(col, 10),
    } as ValidMovesDto);
  }
}
