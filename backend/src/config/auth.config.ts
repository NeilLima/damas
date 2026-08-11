import { registerAs } from '@nestjs/config';

export const authConfig = () => ({
  jwtSecret: process.env.JWT_SECRET || 'madara202431',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
});

export default registerAs('auth', authConfig);
