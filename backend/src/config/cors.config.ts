/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

const isProd = process.env.NODE_ENV === 'production';

export const corsConfig = {
  origin: true, // Permitir todas as origens em qualquer ambiente
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default registerAs('cors', () => corsConfig);
