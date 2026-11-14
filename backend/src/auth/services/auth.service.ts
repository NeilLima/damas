import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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


    const token = this.generateToken(user.id, user.email);

    return { user, token };
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
