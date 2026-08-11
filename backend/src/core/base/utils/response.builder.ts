/* eslint-disable prettier/prettier */

/**
 * Interface para resposta padrão da API
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

/**
 * Classe utilitária para construir respostas padronizadas
 */
export class ResponseBuilder {
  /**
   * Cria uma resposta de sucesso
   * @param data Dados a serem retornados
   * @param message Mensagem opcional
   * @returns Resposta padronizada
   */
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message
    };
  }

  /**
   * Cria uma resposta de erro
   * @param error Mensagem de erro
   * @returns Resposta padronizada
   */
  static error(error: string): ApiResponse<null> {
    return {
      success: false,
      error
    };
  }

  /**
   * Cria uma resposta paginada
   * @param data Dados a serem retornados
   * @param total Total de registros disponíveis
   * @param page Número da página atual
   * @param limit Limite de registros por página
   * @returns Resposta padronizada com metadados de paginação
   */
  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
} 