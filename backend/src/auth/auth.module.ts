import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { CoreModule } from '../core/core.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repository/auth.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SuggestionsModule } from '../modules/suggestions/suggestions.module';

@Module({
  imports: [
    CoreModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') as any },
      }),
    }),
    SuggestionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
