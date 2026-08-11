/* eslint-disable prettier/prettier */

/**
 * Interface para padronização das respostas da API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
  };
} 