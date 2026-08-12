/* eslint-disable prettier/prettier */
// ============================================
// GameModule - Módulo do jogo de Damas
// Multiplayer Online + Game Loop (REST)
// ============================================
import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { GameGateway } from './gateway/GameGateway';
import { GameRoomService } from './services/GameRoomService';
import { GameService } from './services/GameService';
import { GameRepository } from './repository/GameRepository';
import { GameController } from './controllers/GameController';

@Module({
  imports: [CoreModule],
  controllers: [GameController],
  providers: [GameRoomService, GameService, GameRepository, GameGateway],
  exports: [GameRoomService, GameService],
})
export class GameModule {}
