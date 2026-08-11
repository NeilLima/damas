import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente do Supabase usado pelo FRONTEND (site).
 *
 * Aqui usamos a ANON KEY (pública) + a URL do projeto.
 * Isso é o padrão correto para clientes no browser.
 * A proteção real dos dados é feita pelas RLS (Row Level Security)
 * definidas no banco do Supabase.
 *
 * Obs.: Crie o arquivo ".env.local" baseado no ".env.local.example".
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Exemplo de uso:
 *
 *   const { data, error } = await supabase
 *     .from('tabela_do_seu_banco')
 *     .select('*');
 */