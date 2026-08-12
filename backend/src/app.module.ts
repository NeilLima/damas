import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [CoreModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
