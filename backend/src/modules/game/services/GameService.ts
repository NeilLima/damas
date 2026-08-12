/* eslint-disable prettier/prettier */
// ============================================
// GameService - Game Loop (REST)
// Validação: captura, promoção, captura múltipla, turnos, fim de jogo
// ============================================
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GameRepository } from '../repository/GameRepository';
import { GameRoomService } from './GameRoomService';
import { MoveDto, StartGameDto, ValidMovesDto } from '../dto/GameDto';
import {
  BoardPosition,
  GameStatePayload,
  OngoingGame,
  PlayerColor,
} from '../types/GameTypes';
import { createGameLog } from '../logs/GameLogs';

@Injectable()
export class GameService {
  constructor(
    private readonly repository: GameRepository,
    private readonly roomService: GameRoomService,
  ) {}

  /**
   * Inicia uma nova partida e retorna o estado inicial.
   */
  public startGame(dto: StartGameDto): OngoingGame {
    const game: OngoingGame = {
      id: this.repository.generateId(),
      type: dto.type ?? 'PVP',
      playerWhite: dto.playerWhiteId,
      playerBlack: dto.playerBlackId,
      board: this.roomService.initBoard(),
      turn: 'white',
      status: 'active',
      winner: null,
      createdAt: new Date().toISOString(),
    };
    this.repository.save(game);
    createGameLog('info', `Partida ${game.id} iniciada (${game.type})`);
    return game;
  }

  /**
   * Aplica um movimento válido. Lança exceção se a jogada for inválida.
   */
  public makeMove(dto: MoveDto): GameStatePayload {
    const game = this.getGameOrThrow(dto.gameId);

    if (game.status !== 'active') {
      throw new BadRequestException('Partida já encerrada');
    }

    const color = this.getPlayerColor(game, dto.playerId);
    if (color !== game.turn) {
      throw new BadRequestException('Não é a vez desse jogador');
    }

    const source = game.board[dto.from.row]?.[dto.from.col];
    if (!source || source.value === null) {
      throw new BadRequestException('Origem vazia');
    }

    const validMoves = this.roomService.getValidMovesFor(game.board, dto.from, color);
    const isValid = validMoves.some((m) => m.row === dto.to.row && m.col === dto.to.col);
    if (!isValid) {
      throw new BadRequestException('Movimento inválido');
    }

    game.board = this.roomService.applyMove(game.board, dto.from, dto.to);
    game.turn = color === 'white' ? 'black' : 'white';

    if (this.roomService.playerHasLost(game.board, game.turn)) {
      game.status = 'over';
      game.winner = color;
      createGameLog('info', `Partida ${game.id} encerrada: vencedor ${color}`);
    }

    this.repository.save(game);
    return this.toState(game);
  }

  /**
   * Retorna os movimentos válidos de uma peça numa posição.
   */
  public getValidMoves(dto: ValidMovesDto): BoardPosition[] {
    const game = this.getGameOrThrow(dto.gameId);
    const source = game.board[dto.row]?.[dto.col];
    if (!source || source.value === null) {
      throw new BadRequestException('Posição vazia');
    }
    const color = this.roomService.getPieceColorOf(source.value);
    if (!color) {
      throw new BadRequestException('Posição inválida');
    }
    return this.roomService.getValidMovesFor(game.board, { row: dto.row, col: dto.col }, color);
  }

  private getGameOrThrow(gameId: string): OngoingGame {
    const game = this.repository.findById(gameId);
    if (!game) {
      throw new NotFoundException('Partida não encontrada');
    }
    return game;
  }

  private getPlayerColor(game: OngoingGame, playerId: string): PlayerColor {
    if (game.playerWhite === playerId) return 'white';
    if (game.playerBlack === playerId) return 'black';
    throw new BadRequestException('Jogador não pertence à partida');
  }

  private toState(game: OngoingGame): GameStatePayload {
    return {
      gameId: game.id,
      board: game.board,
      turn: game.turn,
      status: game.status,
      winner: game.winner,
    };
  }
}
