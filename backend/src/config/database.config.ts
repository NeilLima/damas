/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Database');

/**
 * Configuração do banco de dados
 */
export default registerAs('database', () => {
  const url = process.env.DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  logger.log(`🔌 Database URL configurada: ${url ? 'Sim' : 'Não'}`);
  logger.log(`🔌 Supabase URL configurada: ${supabaseUrl ? 'Sim' : 'Não'}`);

  return {
    url,
    supabaseUrl,
    supabaseServiceRoleKey,
  };
});
