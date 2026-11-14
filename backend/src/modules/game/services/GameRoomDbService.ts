/* eslint-disable prettier/prettier */
// ============================================
// GameRoomDbService - Salas multiplayer persistidas no banco
// Serverless-safe: estado da sala vive no Postgres (Neon), não em
// memória. Usado pelos endpoints REST de polling quando não há
// WebSocket disponível (deploy Vercel).
// ============================================
import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { GameRoomService } from './GameRoomService';
import type { GameRoom, RoomPlayer, BoardPosition, PlayerColor } from '../types/GameTypes';

@Injectable()
export class GameRoomDbService {
  private readonly logger = new Logger(GameRoomDbService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly roomLogic: GameRoomService,
  ) {}

  /** Cria sala persistida e devolve { code, room }. */
  async createRoom(playerId: string, playerName?: string): Promise<{ code: string; room: GameRoom }> {
    const room = this.newRoom(playerId, playerName);
    const code = await this.saveRoom(room);
    return { code, room };
  }

  /** Entra numa sala pelo código. Lança exceção se cheia/inexistente. */
  async joinRoom(code: string, playerId: string, playerName?: string): Promise<{ room: GameRoom; color: PlayerColor }> {
    const room = await this.loadRoom(code);
    if (room.status === 'playing' || room.status === 'over') {
      // Se o próprio jogador já está na sala, devolve o estado atual
      const existing = room.players.find((p) => p.id === playerId);
      if (existing) return { room, color: existing.color };
      throw new ConflictException('SalaCheia');
    }
    if (room.players.find((p) => p.id === playerId)) {
      return { room, color: room.players.find((p) => p.id === playerId)!.color };
    }
    if (room.players.length >= 2) throw new ConflictException('SalaCheia');

    room.players.push({ id: playerId, name: playerName || 'Jogador', color: 'black' });
    if (room.players.length === 2) {
      room.status = 'playing';
      room.turn = 'white';
    }
    await this.persist(code, room);
    return { room, color: room.players[room.players.length - 1].color };
  }

  /** Estado atual da sala (polling). */
  async getState(code: string, playerId?: string) {
    const room = await this.loadRoom(code);
    const me = playerId ? room.players.find((p) => p.id === playerId) : undefined;
    return {
      roomId: code,
      color: me?.color ?? null,
      status: room.status,
      winner: room.winner,
      turn: room.turn,
      lastMove: room.lastMove,
      players: room.players,
      state: this.roomLogic.toState(room),
    };
  }

  /** Aplica movimento validado pela mesma lógica do socket. */
  async makeMove(code: string, playerId: string, from: BoardPosition, to: BoardPosition) {
    const room = await this.loadRoom(code);
    if (room.status !== 'playing') throw new BadRequestException('JogoNaoEstaEmAndamento');

    const player = room.players.find((p) => p.id === playerId);
    if (!player || player.color !== room.turn) throw new BadRequestException('NaoEhSuaVez');

    const source = room.board[from.row]?.[from.col];
    if (!source || source.value === null) throw new BadRequestException('PosicaoInvalida');
    if (this.roomLogic.getPieceColorOf(source.value) !== player.color) {
      throw new BadRequestException('PecaNaoEhSua');
    }

    const valid = this.roomLogic.getValidMovesFor(room.board, from, player.color);
    if (!valid.some((m) => m.row === to.row && m.col === to.col)) {
      throw new BadRequestException('MovimentoInvalido');
    }

    room.board = this.roomLogic.applyMove(room.board, from, to);
    room.lastMove = { from: { ...from }, to: { ...to } };
    room.turn = player.color === 'white' ? 'black' : 'white';

    if (this.roomLogic.playerHasLost(room.board, room.turn)) {
      room.status = 'over';
      room.winner = player.color;
    }

    await this.persist(code, room);
    return {
      roomId: code,
      status: room.status,
      winner: room.winner,
      turn: room.turn,
      lastMove: room.lastMove,
      state: this.roomLogic.toState(room),
    };
  }

  /** Reinicia a sala (mantém os 2 jogadores). */
  async reset(code: string) {
    const room = await this.loadRoom(code);
    room.board = this.roomLogic.initBoard();
    room.turn = 'white';
    room.status = room.players.length >= 2 ? 'playing' : 'waiting';
    room.winner = null;
    room.lastMove = null;
    await this.persist(code, room);
    return this.getState(code);
  }

  /** Jogador sai da sala. */
  async leave(code: string, playerId: string) {
    const room = await this.loadRoom(code);
    room.players = room.players.filter((p) => p.id !== playerId);
    if (room.players.length === 0) {
      await this.prisma.gameRoomState.delete({ where: { code } }).catch(() => undefined);
      return { removed: true };
    }
    room.status = 'waiting';
    room.winner = null;
    await this.persist(code, room);
    return { removed: false, state: this.roomLogic.toState(room) };
  }

  // ============================================
  // INTERNOS
  // ============================================

  private newRoom(playerId: string, playerName?: string): GameRoom {
    return {
      id: '',
      players: [{ id: playerId, name: playerName || 'Jogador', color: 'white' }],
      board: this.roomLogic.initBoard(),
      turn: 'white',
      status: 'waiting',
      winner: null,
      lastMove: null,
    };
  }

  private async loadRoom(code: string): Promise<GameRoom> {
    const row = await this.prisma.gameRoomState.findUnique({ where: { code } });
    if (!row) throw new NotFoundException('SalaNaoEncontrada');
    return row.stateJson as unknown as GameRoom;
  }

  private async persist(code: string, room: GameRoom): Promise<void> {
    await this.prisma.gameRoomState.update({
      where: { code },
      data: { stateJson: room as object },
    });
  }

  /** Gera código curto e persiste a sala nova. */
  private async saveRoom(room: GameRoom): Promise<string> {
    const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    for (let attempt = 0; attempt < 10; attempt++) {
      let code = '';
      for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
      try {
        await this.prisma.gameRoomState.create({
          data: { code, stateJson: room as object },
        });
        room.id = code;
        // Atualiza o id dentro do JSON persistido
        await this.prisma.gameRoomState.update({
          where: { code },
          data: { stateJson: { ...(room as object), id: code } },
        });
        return code;
      } catch {
        // código duplicado — tenta outro
      }
    }
    throw new Error('NaoFoiPossivelGerarCodigoDeSala');
  }
}
