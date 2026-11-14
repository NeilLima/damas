import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';

// Cache do app Nest entre invocações (lambda warm no Vercel)
type NestApp = Awaited<ReturnType<typeof NestFactory.create>>;
let cachedApp: NestApp | null = null;

async function createApp(): Promise<NestApp> {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  app.enableCors(corsConfig);
  await app.init();
  return app;
}

/**
 * Handler do Vercel Serverless — auto-detectado via api/index.js → dist/main.
 * Reusa o app entre invocações (lambda warm).
 * NOTA: o gateway WebSocket não funciona em serverless — o multiplayer
 * usa os endpoints REST /game/rooms (polling) nesse ambiente.
 */
export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    let app = cachedApp;
    if (!app) {
      app = await createApp();
      cachedApp = app;
      console.log('✅ NestJS app initialized for Vercel');
    }
    const instance = app.getHttpAdapter().getInstance();
    instance(req, res);
  } catch (error: unknown) {
    console.error('🔥 Vercel handler error:', error instanceof Error ? error.message : 'Error');
    res.status(500).json({ statusCode: 500, message: error instanceof Error ? error.message : 'Error' });
  }
}

// Local development bootstrap
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ?? 3002;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend is running on: http://0.0.0.0:${port}`);
}

if (require.main === module) {
  bootstrap();
}
