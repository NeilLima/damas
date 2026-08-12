/* eslint-disable prettier/prettier */
// ============================================
// GameRoomService - Salas de jogo em memória
// Multiplayer Online (Damas)
// ============================================
import { Injectable, Logger } from '@nestjs/common';
import {
  BoardCell,
  BoardPosition,
  CellValue,
  GameRoom,
  PlayerColor,
  RoomPlayer,
  RoomState,
} from '../types/GameTypes';

// Salas em memória: não dependem do banco (modelos Game/Move são outra feature).
@Injectable()
export class GameRoomService {
  private readonly logger = new Logger(GameRoomService.name);
  private readonly rooms = new Map<string, GameRoom>();
  private readonly idCounter = { value: 0 };

  // ============================================
  // TABULEIRO (autoritativo, espelha BoardServices)
  // ============================================

  public initBoard(): BoardCell[][] {
    const board: BoardCell[][] = [];
    for (let row = 0; row < 8; row++) {
      board[row] = [];
      for (let col = 0; col < 8; col++) {
        const isPlayable = (row + col) % 2 !== 0;
        let value: CellValue = null;
        if (isPlayable) {
          if (row < 3) value = 'black';
          else if (row > 4) value = 'white';
        }
        board[row][col] = { position: { row, col }, value, isPlayable };
      }
    }
    return board;
  }

  private getPieceColor(value: CellValue): PlayerColor | null {
    if (value === 'white' || value === 'white-king') return 'white';
    if (value === 'black' || value === 'black-king') return 'black';
    return null;
  }

  private isKing(value: CellValue): boolean {
    return value === 'white-king' || value === 'black-king';
  }

  private cloneBoard(cells: BoardCell[][]): BoardCell[][] {
    return cells.map((row) => row.map((cell) => ({ ...cell, position: { ...cell.position } })));
  }

  private getValidMoves(cells: BoardCell[][], position: BoardPosition, pieceColor: PlayerColor): BoardPosition[] {
    const { row, col } = position;
    const moves: BoardPosition[] = [];
    const piece = cells[row][col].value;
    if (!piece) return moves;

    const kingPiece = this.isKing(piece);
    const forwardDirs = pieceColor === 'white' ? [-1] : [1];
    const allRowDirs = [-1, 1];

    if (kingPiece) {
      for (const dRow of allRowDirs) {
        for (const dCol of [-1, 1]) {
          let r = row + dRow;
          let c = col + dCol;
          let crossedEnemy = false;
          while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const targetCell = cells[r][c];
            if (!targetCell.isPlayable) break;
            const targetColor = this.getPieceColor(targetCell.value);
            if (targetColor === null) {
              moves.push({ row: r, col: c });
              if (crossedEnemy) break;
            } else if (targetColor === pieceColor) {
              break;
            } else {
              if (crossedEnemy) break;
              crossedEnemy = true;
            }
            r += dRow;
            c += dCol;
          }
        }
      }
    } else {
      // Capturas em todas as diagonais (frente e trás)
      for (const dRow of allRowDirs) {
        for (const dCol of [-1, 1]) {
          const mr = row + dRow;
          const mc = col + dCol;
          if (mr < 0 || mr >= 8 || mc < 0 || mc >= 8) continue;
          const midColor = this.getPieceColor(cells[mr][mc].value);
          if (midColor && midColor !== pieceColor) {
            const lr = row + dRow * 2;
            const lc = col + dCol * 2;
            if (lr >= 0 && lr < 8 && lc >= 0 && lc < 8) {
              const land = cells[lr][lc];
              if (land.value === null && land.isPlayable) {
                moves.push({ row: lr, col: lc });
              }
            }
          }
        }
      }
      // Movimento simples: 1 casa para frente
      for (const dCol of [-1, 1]) {
        const fr = row + forwardDirs[0];
        const fc = col + dCol;
        if (fr >= 0 && fr < 8 && fc >= 0 && fc < 8) {
          const target = cells[fr][fc];
          if (target.value === null && target.isPlayable) {
            moves.push({ row: fr, col: fc });
          }
        }
      }
    }
    return moves;
  }

  public movePiece(cells: BoardCell[][], from: BoardPosition, to: BoardPosition): BoardCell[][] {
    const newCells = this.cloneBoard(cells);
    const piece = newCells[from.row][from.col].value;

    const rowDir = Math.sign(to.row - from.row);
    const colDir = Math.sign(to.col - from.col);
    let r = from.row + rowDir;
    let c = from.col + colDir;
    while (r !== to.row || c !== to.col) {
      const mid = newCells[r][c];
      if (mid.value !== null) {
        newCells[r][c] = { ...mid, value: null };
      }
      r += rowDir;
      c += colDir;
    }

    let newValue: CellValue = piece;
    if (piece === 'white' && to.row === 0) newValue = 'white-king';
    if (piece === 'black' && to.row === 7) newValue = 'black-king';

    newCells[to.row][to.col] = { ...newCells[to.row][to.col], value: newValue };
    newCells[from.row][from.col] = { ...newCells[from.row][from.col], value: null };

    return newCells;
  }

  private hasEnemyInPath(cells: BoardCell[][], from: BoardPosition, to: BoardPosition, color: PlayerColor): boolean {
    const rowDir = Math.sign(to.row - from.row);
    const colDir = Math.sign(to.col - from.col);
    let r = from.row + rowDir;
    let c = from.col + colDir;
    while (r !== to.row || c !== to.col) {
      const midColor = this.getPieceColor(cells[r][c].value);
      if (midColor !== null && midColor !== color) return true;
      r += rowDir;
      c += colDir;
    }
    return false;
  }

  // ============================================
  // SALAS
  // ============================================

  public createRoom(playerId: string, playerName?: string): GameRoom {
    this.idCounter.value += 1;
    const id = `room-${this.idCounter.value}`;
    const room: GameRoom = {
      id,
      players: [{ id: playerId, name: playerName || 'Jogador', color: 'white' }],
      board: this.initBoard(),
      turn: 'white',
      status: 'waiting',
      winner: null,
      lastMove: null,
    };
    this.rooms.set(id, room);
    this.logger.log(`Sala ${id} criada por ${playerName}`);
    return room;
  }

  public joinRoom(roomId: string, playerId: string, playerName?: string): GameRoom {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('RoomNotFound');
    if (room.status === 'playing' || room.status === 'over') throw new Error('RoomFull');
    if (room.players.find((p) => p.id === playerId)) return room;
    if (room.players.length >= 2) throw new Error('RoomFull');
    room.players.push({ id: playerId, name: playerName || 'Jogador', color: 'black' });
    if (room.players.length === 2) {
      room.status = 'playing';
      room.turn = 'white';
    }
    this.logger.log(`Sala ${roomId}: ${playerName} entrou`);
    return room;
  }

  public getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  public removePlayer(roomId: string, playerId: string): GameRoom | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;
    room.players = room.players.filter((p) => p.id !== playerId);
    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return undefined;
    }
    room.status = 'waiting';
    room.winner = null;
    return room;
  }

  public toState(room: GameRoom): RoomState {
    return { board: room.board, turn: room.turn };
  }

  /** Aplica um movimento se válido e se for a vez do jogador. Retorna null se inválido. */
  public makeMove(roomId: string, playerId: string, from: BoardPosition, to: BoardPosition): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'playing') return null;

    const player = room.players.find((p) => p.id === playerId);
    if (!player || player.color !== room.turn) return null;

    const source = room.board[from.row]?.[from.col];
    if (!source || source.value === null) return null;
    if (this.getPieceColor(source.value) !== player.color) return null;

    const validMoves = this.getValidMoves(room.board, from, player.color);
    const isValid = validMoves.some((m) => m.row === to.row && m.col === to.col);
    if (!isValid) return null;

    room.board = this.movePiece(room.board, from, to);
    room.lastMove = { from: { ...from }, to: { ...to } };
    room.turn = player.color === 'white' ? 'black' : 'white';

    if (this.hasLost(room.board, room.turn)) {
      room.status = 'over';
      room.winner = player.color;
    }

    return room;
  }

  private hasLost(cells: BoardCell[][], color: PlayerColor): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = cells[row][col].value;
        if (piece && this.getPieceColor(piece) === color) {
          if (this.getValidMoves(cells, { row, col }, color).length > 0) return false;
        }
      }
    }
    return true;
  }

  public reset(roomId: string): GameRoom | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;
    room.board = this.initBoard();
    room.turn = 'white';
    room.status = room.players.length >= 2 ? 'playing' : 'waiting';
    room.winner = null;
    room.lastMove = null;
    return room;
  }
}
