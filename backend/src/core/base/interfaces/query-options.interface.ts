/* eslint-disable prettier/prettier */

/**
 * Interface para opções de consulta usadas em operações de leitura
 */
export interface QueryOptions {
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  select?: string | string[];
  populate?: string | string[] | Record<string, any>;
  lean?: boolean;
  collation?: { locale: string; strength?: number };
}

/**
 * Interface para opções de filtro
 */
export interface FilterOptions {
  [key: string]: any;
} 