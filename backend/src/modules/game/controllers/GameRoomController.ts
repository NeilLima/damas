/* eslint-disable prettier/prettier */
// ============================================
// GameRoomController - Multiplayer via REST (polling)
// Serverless-safe: funciona na Vercel sem WebSocket.
// O frontend faz polling em GET /game/rooms/:code a cada ~1.5s.
// ============================================
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { GameRoomDbService } from '../services/GameRoomDbService';
import type { BoardPosition } from '../types/GameTypes';

interface CreateRoomBody {
  playerId: string;
  playerName?: string;
}

interface JoinRoomBody {
  code: string;
  playerId: string;
  playerName?: string;
}

interface MoveBody {
  playerId: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

@Controller('game/rooms')
export class GameRoomController {
  constructor(private readonly rooms: GameRoomDbService) {}

  /** Cria sala → { code } para compartilhar com o oponente. */
  @Post()
  async create(@Body() body: CreateRoomBody) {
    const { code, room } = await this.rooms.createRoom(body.playerId, body.playerName);
    return {
      roomId: code,
      color: room.players[0].color,
      players: room.players,
      status: room.status,
    };
  }

  /** Entrar numa sala existente pelo código. */
  @Post('join')
  async join(@Body() body: JoinRoomBody) {
    const { room, color } = await this.rooms.joinRoom(body.code, body.playerId, body.playerName);
    return {
      roomId: body.code,
      color,
      players: room.players,
      status: room.status,
      state: { board: room.board, turn: room.turn },
    };
  }

  /** Polling: estado atual da sala (tabuleiro, vez, status, último lance). */
  @Get(':code')
  async state(@Param('code') code: string, @Query('playerId') playerId?: string) {
    return this.rooms.getState(code, playerId);
  }

  /** Joga uma peça. */
  @Post(':code/move')
  async move(@Param('code') code: string, @Body() body: MoveBody) {
    const from: BoardPosition = { row: body.fromRow, col: body.fromCol };
    const to: BoardPosition = { row: body.toRow, col: body.toCol };
    return this.rooms.makeMove(code, body.playerId, from, to);
  }

  /** Reinicia a partida na mesma sala. */
  @Post(':code/reset')
  async reset(@Param('code') code: string) {
    return this.rooms.reset(code);
  }

  /** Sair da sala. */
  @Delete(':code')
  async leave(@Param('code') code: string, @Query('playerId') playerId: string) {
    return this.rooms.leave(code, playerId);
  }
}
