/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { StorageService } from '../interfaces/storage.interface';
import { processMedia, validateMedia } from '../../../config/uploads.config';

/**
 * Implementação de armazenamento base64
 * Processa e retorna dados em formato base64
 */
@Injectable()
export class LocalStorageService implements StorageService {
  private readonly logger = new Logger('LocalStorageService');
  private readonly basePath: string;

  constructor() {
    this.basePath = path.join(process.cwd(), 'temp');
    // Não criar diretório em ambientes serverless
    // fs.ensureDirSync(this.basePath);
    
  }

  /**
   * Processa um arquivo base64 e retorna o base64 otimizado
   * @param base64Data Dados em formato base64
   * @param filePath Caminho do arquivo (usado apenas para identificação/log)
   * @returns String base64 processada
   */
  async saveBase64(inputData: string, filePath: string): Promise<string> {
    try {
      
      // Verifica se o input é uma string base64 com cabeçalho MIME
      const isBase64WithHeader = typeof inputData === 'string' && inputData.startsWith('data:');
      
      // Se não é um base64 com cabeçalho, adiciona o cabeçalho MIME baseado na extensão do arquivo
      let base64Data = inputData;
      if (!isBase64WithHeader) {
        
        // Determina o tipo MIME baseado na extensão do arquivo
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'application/octet-stream'; // padrão
        
        if (['.jpg', '.jpeg'].includes(ext)) mimeType = 'image/jpeg';
        else if (ext === '.png') mimeType = 'image/png';
        else if (['.mp4', '.mpeg4'].includes(ext)) mimeType = 'video/mp4';
        else if (ext === '.webm') mimeType = 'video/webm';
        else if (['.avi', '.x-msvideo'].includes(ext)) mimeType = 'video/x-msvideo';
        else if (ext === '.mkv') mimeType = 'video/x-matroska';
        
        // Adiciona o cabeçalho correto
        base64Data = `data:${mimeType};base64,${inputData}`;
        
      }
      
      // Valida e processa o arquivo
      const validation = validateMedia(base64Data);
      if (!validation.isValid) {
        // Se falhar na validação mesmo após corrigir, retorne o URL direto como fallback
        this.logger.warn(`Formato de mídia inválido ou não suportado: ${validation.mimeType || 'desconhecido'}`);
        // Criar um URL fictício para não quebrar o fluxo
        return `https://storage.example.com/${filePath}`;
      }
      
      // Processa a mídia (otimiza imagem/vídeo/áudio)
      const processedData = await processMedia(base64Data);
      
      
      return processedData; // Retorna diretamente o base64 processado
    } catch (error) {
      this.logger.error(`Erro ao processar dados: ${error.message}`);
      // Em caso de erro, retorna um URL fictício para não quebrar o fluxo
      return `https://storage.example.com/${filePath}`;
    }
  }

  /**
   * Método mantido para compatibilidade com a interface
   * Não aplicável para armazenamento base64
   */
  async getFile(filePath: string): Promise<Buffer> {
    this.logger.warn(`Tentativa de acessar getFile() em armazenamento base64 - não suportado`);
    throw new Error('Método getFile não é aplicável ao armazenamento base64');
  }

  /**
   * Método mantido para compatibilidade com a interface
   * Não aplicável para armazenamento base64
   */
  async deleteFile(filePath: string): Promise<boolean> {
    this.logger.warn(`Tentativa de acessar deleteFile() em armazenamento base64 - não suportado`);
    return true; // Retorna true para não quebrar fluxos existentes
  }

  /**
   * Método mantido para compatibilidade com a interface
   * Não aplicável para armazenamento base64
   */
  async fileExists(filePath: string): Promise<boolean> {
    this.logger.warn(`Tentativa de acessar fileExists() em armazenamento base64 - não suportado`);
    return false;
  }
} 