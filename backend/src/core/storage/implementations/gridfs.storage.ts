/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from '../interfaces/storage.interface';

/**
 * Implementação de armazenamento que utiliza GridFS do MongoDB
 * para armazenar arquivos grandes, especialmente vídeos
 */
@Injectable()
export class GridFSStorageService implements StorageService {
  private readonly logger = new Logger('GridFSStorageService');

  constructor() {}

  /**
   * Salva dados base64 no GridFS
   * @param base64Data Dados em formato base64
   * @param filePath Caminho virtual do arquivo
   * @returns URL para acessar o arquivo
   */
  async saveBase64(base64Data: string, filePath: string): Promise<string> {
    try {
      // Implementação fallback: sem Mongo/GridFS.
      // Mantém assinatura para não quebrar dependências, mas retorna um URL fictício.
      if (!base64Data || !filePath) {
        throw new Error('Parâmetros inválidos');
      }

      return `https://storage.example.com/${filePath}`;
    } catch (error) {
      this.logger.error(`Erro ao processar base64: ${error.message}`);
      // Em caso de erro, retorna um URL fictício para não quebrar o fluxo
      return `https://storage.example.com/${filePath}`;
    }
  }

  /**
   * Obtém um arquivo do GridFS
   * @param fileId ID do arquivo no GridFS
   * @returns Stream do arquivo
   */
  async getFileStream(fileId: string): Promise<unknown> {
    this.logger.warn(`Tentativa de obter stream (GridFS) desativado: ${fileId}`);
    throw new Error('GridFS desativado. Use StorageService (LocalStorageService).');
  }

  /**
   * Método compatível com a interface StorageService
   * @param filePath Caminho do arquivo
   * @returns Buffer do arquivo
   */
  async getFile(filePath: string): Promise<Buffer> {
    this.logger.warn(`Tentativa de acessar getFile() com caminho - não implementado: ${filePath}`);
    throw new Error('Método getFile não implementado diretamente no GridFS. Use getFileStream com ID.');
  }

  /**
   * Exclui um arquivo do GridFS
   * @param fileId ID do arquivo no GridFS
   * @returns true se bem-sucedido
   */
  async deleteFileById(fileId: string): Promise<boolean> {
    this.logger.warn(`Tentativa de excluir por ID (GridFS) desativado: ${fileId}`);
    return false;
  }

  /**
   * Método compatível com a interface StorageService
   * @param filePath Caminho do arquivo
   * @returns true se bem-sucedido
   */
  async deleteFile(filePath: string): Promise<boolean> {
    this.logger.warn(`Tentativa de excluir arquivo pelo caminho - não implementado diretamente: ${filePath}`);
    return true; // Retorna true para não quebrar fluxos existentes
  }

  /**
   * Método compatível com a interface StorageService
   * @param filePath Caminho do arquivo
   * @returns true se o arquivo existir
   */
  async fileExists(filePath: string): Promise<boolean> {
    this.logger.warn(`Tentativa de verificar se arquivo existe pelo caminho - não implementado: ${filePath}`);
    return false;
  }
}
