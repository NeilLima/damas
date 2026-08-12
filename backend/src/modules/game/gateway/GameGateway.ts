/* eslint-disable prettier/prettier */
// ============================================
// GameGateway - WebSocket (Socket.io)
// Multiplayer Online (Damas)
// ============================================
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameRoomService } from '../services/GameRoomService';
import { ChooseColorDto, JoinRoomDto, MakeMoveDto, ResetDto } from '../dto/GameDto';
import { createGameLog } from '../logs/GameLogs';

interface ClientData {
  playerId: string;
  playerName: string;
  roomId: string | null;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server;

  private readonly logger = new Logger(GameGateway.name);
  private readonly clients = new Map<string, ClientData>();

  constructor(private readonly roomService: GameRoomService) {}

  handleConnection(client: Socket): void {
    this.clients.set(client.id, { playerId: '', playerName: '', roomId: null });
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    const data = this.clients.get(client.id);
    if (data && data.roomId) {
      this.handleLeave(client, data.roomId);
    }
    this.clients.delete(client.id);
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('game:create')
  handleCreate(@ConnectedSocket() client: Socket, @MessageBody() body: JoinRoomDto): void {
    const room = this.roomService.createRoom(body.playerId, body.playerName);
    client.join(room.id);
    this.clients.set(client.id, { playerId: body.playerId, playerName: body.playerName ?? '', roomId: room.id });
    client.emit('room:created', {
      roomId: room.id,
      playerId: body.playerId,
      color: room.players[0].color,
      state: this.roomService.toState(room),
    });
    createGameLog('info', `Sala ${room.id} criada`);
  }

  @SubscribeMessage('game:join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() body: JoinRoomDto): void {
    try {
      const room = this.roomService.joinRoom(body.roomId!, body.playerId, body.playerName);
      client.join(room.id);
      this.clients.set(client.id, {
        playerId: body.playerId,
        playerName: body.playerName ?? '',
        roomId: room.id,
      });

      const player = room.players.find((p) => p.id === body.playerId);
      client.emit('room:joined', {
        roomId: room.id,
        playerId: body.playerId,
        color: player ? player.color : 'black',
        state: this.roomService.toState(room),
      });

      if (room.status === 'playing') {
        this.server.to(room.id).emit('game:start', {
          roomId: room.id,
          state: this.roomService.toState(room),
          players: room.players,
        });
        createGameLog('info', `Jogo iniciado na sala ${room.id}`);
      }
    } catch (error) {
      client.emit('room:error', { message: String((error as Error).message) });
    }
  }

  @SubscribeMessage('game:move')
  handleMove(@ConnectedSocket() client: Socket, @MessageBody() body: MakeMoveDto): void {
    const data = this.clients.get(client.id);
    if (!data || !data.roomId) {
      client.emit('move:rejected', { reason: 'NotInRoom' });
      return;
    }

    const room = this.roomService.makeMove(body.roomId, data.playerId, {
      row: body.fromRow,
      col: body.fromCol,
    }, { row: body.toRow, col: body.toCol });

    if (!room) {
      client.emit('move:rejected', { reason: 'InvalidMove' });
      return;
    }

    this.server.to(room.id).emit('move:made', {
      roomId: room.id,
      state: this.roomService.toState(room),
      lastMove: room.lastMove,
    });

    if (room.status === 'over') {
      this.server.to(room.id).emit('game:over', {
        roomId: room.id,
        winner: room.winner,
        state: this.roomService.toState(room),
      });
      createGameLog('info', `Fim de jogo na sala ${room.id}: vencedor ${room.winner}`);
    }
  }

  @SubscribeMessage('game:reset')
  handleReset(@ConnectedSocket() client: Socket, @MessageBody() body: ResetDto): void {
    const room = this.roomService.reset(body.roomId);
    if (!room) return;
    this.server.to(room.id).emit('game:start', {
      roomId: room.id,
      state: this.roomService.toState(room),
      players: room.players,
    });
    createGameLog('info', `Sala ${room.id} reiniciada`);
  }

  @SubscribeMessage('game:chooseColor')
  handleChooseColor(@ConnectedSocket() client: Socket, @MessageBody() body: ChooseColorDto): void {
    const data = this.clients.get(client.id);
    if (!data) return;
    client.emit('room:color', { roomId: body.roomId, color: body.color });
  }

  @SubscribeMessage('game:leave')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() roomId: string): void {
    const data = this.clients.get(client.id);
    if (!data) return;
    if (!roomId && !data.roomId) return;
    const rid = roomId || data.roomId!;
    client.leave(rid);
    this.clients.set(client.id, { ...data, roomId: null });
    const room = this.roomService.removePlayer(rid, data.playerId);
    if (!room) {
      this.server.to(rid).emit('room:closed', { roomId: rid });
      return;
    }
    this.server.to(rid).emit('player:disconnected', { roomId: rid, playerId: data.playerId });
    createGameLog('warn', `Jogador ${data.playerId} saiu da sala ${rid}`);
  }
}
