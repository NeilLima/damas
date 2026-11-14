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
import { GameRoomController } from './controllers/GameRoomController';
import { GameRoomDbService } from './services/GameRoomDbService';

@Module({
  imports: [CoreModule],
  controllers: [GameController, GameRoomController],
  providers: [GameRoomService, GameService, GameRepository, GameGateway, GameRoomDbService],
  exports: [GameRoomService, GameService],
})
export class GameModule {}
