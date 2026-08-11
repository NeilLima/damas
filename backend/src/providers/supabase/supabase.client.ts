import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import databaseConfig from '../../config/database.config';

@Injectable()
export class SupabaseClientProvider {
  private readonly client: SupabaseClient;

  constructor() {
    const config = databaseConfig();

    if (!config.supabaseUrl) {
      throw new Error('Missing env: SUPABASE_URL');
    }

    if (!config.supabaseServiceRoleKey) {
      throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
    }

    this.client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }

  get(): SupabaseClient {
    return this.client;
  }
}
