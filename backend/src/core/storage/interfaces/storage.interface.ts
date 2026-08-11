/* eslint-disable prettier/prettier */

/**
 * Interface para o serviço de armazenamento
 * Define métodos para manipulação de arquivos
 */
export interface StorageService {
  /**
   * Salva um arquivo base64 no sistema de armazenamento
   */
  saveBase64(base64Data: string, path: string): Promise<string>;
  
  /**
   * Recupera um arquivo do sistema de armazenamento
   */
  getFile(path: string): Promise<Buffer>;
  
  /**
   * Remove um arquivo do sistema de armazenamento
   */
  deleteFile(path: string): Promise<boolean>;
  
  /**
   * Verifica se um arquivo existe no sistema de armazenamento
   */
  fileExists(path: string): Promise<boolean>;
} 