/* eslint-disable prettier/prettier */
// ============================================
// GameRepository - Persistência de partidas (em memória)
// Game Loop Backend (Damas)
// ============================================
import { Injectable } from '@nestjs/common';
import { OngoingGame } from '../types/GameTypes';

// A persistência em banco (modelos Game/Move via Prisma) pertence à feature
// "banco-de-dados-prisma" (a50). Enquanto ela não existir, mantemos as
// partidas em memória para o game loop funcional.
@Injectable()
export class GameRepository {
  private readonly games = new Map<string, OngoingGame>();
  private readonly idCounter = { value: 0 };

  public generateId(): string {
    this.idCounter.value += 1;
    return `game-${this.idCounter.value}`;
  }

  public save(game: OngoingGame): OngoingGame {
    this.games.set(game.id, game);
    return game;
  }

  public findById(id: string): OngoingGame | undefined {
    return this.games.get(id);
  }

  public remove(id: string): boolean {
    return this.games.delete(id);
  }
}
