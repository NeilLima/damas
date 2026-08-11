import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: any) {
    const userId = randomUUID();
    const profileId = randomUUID();

    return this.prisma.user.create({
      data: {
        id: userId,
        email: data.email,
        password: data.password,
        username: data.username,
        profile: {
          create: {
            id: profileId,
            ...data.profile,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }
}
