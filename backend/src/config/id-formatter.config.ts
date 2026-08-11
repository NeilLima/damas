/* eslint-disable prettier/prettier */

/**
 * Configuração para formatação e manipulação de IDs
 */
export class IdFormatter {
  /**
   * Converte um ID para string de forma segura
   * @param id ID ou string
   * @returns string representação do ID
   */
  static format(id: unknown): string {
    if (!id) {
      return '';
    }
    
    if (typeof id === 'string') {
      return id;
    }
    
    return id.toString();
  }

  /**
   * Verifica se uma string é um ID válido
   * @param id string para verificar
   * @returns boolean
   */
  static isValid(id: string): boolean {
    return typeof id === 'string' && id.trim().length > 0;
  }

  /**
   * Converte uma string para ID
   * @param id string para converter
   * @returns string
   * @throws Error se o ID for inválido
   */
  static toId(id: string): string {
    if (!this.isValid(id)) {
      throw new Error(`ID inválido: ${id}`);
    }
    return id;
  }
}
