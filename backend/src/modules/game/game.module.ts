/* eslint-disable prettier/prettier */
// ============================================
// GameModule - Módulo do jogo de Damas
// Multiplayer Online
// ============================================
import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { GameGateway } from './gateway/GameGateway';
import { GameRoomService } from './services/GameRoomService';

@Module({
  imports: [CoreModule],
  providers: [GameRoomService, GameGateway],
  exports: [GameRoomService],
})
export class GameModule {}
