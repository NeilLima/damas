/* eslint-disable prettier/prettier */
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

import { processMedia, validateMedia } from '../../../config/uploads.config';

/**
 * Decorador para validar e processar uploads base64 automaticamente
 * Pode ser aplicado a parâmetros do controlador
 */
export const ProcessUpload = createParamDecorator(
  async (options: { 
    field?: string;
    required?: boolean;
  } = {}, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { field = 'file', required = false } = options;
    
    // Acessa o campo especificado no body
    const base64Data = field.includes('.')
      ? field.split('.').reduce((obj, prop) => obj && obj[prop], request.body)
      : request.body[field];
    
    // Verifica se o campo é obrigatório
    if (!base64Data) {
      if (required) {
        throw new BadRequestException(`Campo '${field}' obrigatório`);
      }
      return null;
    }
    
    // Valida o formato
    const validation = validateMedia(base64Data);
    if (!validation.isValid) {
      throw new BadRequestException(`Formato de mídia inválido: ${validation.mimeType || 'desconhecido'}`);
    }
    
    try {
      // Processa a mídia (otimiza imagem/vídeo/áudio)
      const processedData = await processMedia(base64Data);
      return {
        data: processedData,
        type: validation.type,
        mimeType: validation.mimeType
      };
    } catch (error) {
      throw new BadRequestException(`Erro ao processar upload: ${error.message}`);
    }
  },
);

/**
 * Interface para o resultado do processamento de upload
 */
export interface ProcessedUpload {
  data: string;
  type: 'image' | 'video' | 'audio';
  mimeType: string;
} 