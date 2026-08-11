import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'madara202431',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
}));
