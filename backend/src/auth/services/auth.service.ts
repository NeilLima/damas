import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthRepository } from '../repository/auth.repository';
import { SuggestionService } from '../../modules/suggestions/services/suggestions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly suggestionService: SuggestionService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepository.findUserByEmail(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já está em uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const birthDate = dto.birthDate ? new Date(dto.birthDate) : null;

    const user = await this.authRepository.createUser({
      email: dto.email,
      password: hashedPassword,
      username: null,
      profile: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        countryIso2: dto.countryIso2 ?? null,
        stateIso2: dto.stateIso2 ?? null,
        city: dto.city ?? null,
        birthDate,
        gender: dto.gender ?? null,
      },
    });

    // Gerar sugestões automaticamente se o usuário tiver país definido (não bloqueante)
    if (dto.countryIso2) {
      // Executar em background sem await para não atrasar o registro
      this.generateSuggestionsForNewUser(user.id, dto.countryIso2).catch(() => {
        // Silenciar erros - não deve afetar o registro
      });
    }

    const token = this.generateToken(user.id, user.email);

    return { user, token };
  }

  private async generateSuggestionsForNewUser(userId: string, countryIso2: string): Promise<void> {
    try {
      // Buscar todos os usuários com o mesmo país
      const usersInSameCountry = await this.suggestionService.findUsersInSameCountry(userId, countryIso2, 50);
      
      // Gerar sugestões para cada usuário encontrado
      for (const suggestedId of usersInSameCountry) {
        await this.suggestionService.generateSuggestion(userId, suggestedId);
        // Também gerar a sugestão reversa (para que o outro usuário veja este)
        await this.suggestionService.generateSuggestion(suggestedId, userId);
      }
      
      console.log(`✅ Sugestões geradas para novo usuário ${userId}: ${usersInSameCountry.length} encontrados`);
    } catch (error) {
      // Não falhar o registro se a geração de sugestões falhar
      console.error('Erro ao gerar sugestões para novo usuário:', error);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.generateToken(user.id, user.email);

    return { user, token };
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') as any,
    };
    return this.jwtService.sign(payload, options);
  }
}
