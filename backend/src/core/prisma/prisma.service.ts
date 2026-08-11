import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    
    // Garante que a URL tenha connection_limit para respeitar o limite do Supabase Pooler (15 connections max)
    const urlWithPool = databaseUrl?.includes('connection_limit')
      ? databaseUrl
      : databaseUrl?.includes('?')
        ? `${databaseUrl}&connection_limit=5`
        : `${databaseUrl}?connection_limit=5`;

    super({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: urlWithPool,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}