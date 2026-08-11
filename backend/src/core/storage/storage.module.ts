/* eslint-disable prettier/prettier */
import { Module, Global } from '@nestjs/common';
import { LocalStorageService } from './implementations/local.storage';

/**
 * Módulo para serviços de armazenamento
 * Global para estar disponível em toda a aplicação
 */
@Global()
@Module({
  providers: [
    // Serviço original para compatibilidade com código existente
    {
      provide: 'StorageService',
      useClass: LocalStorageService,
    },
  ],
  exports: ['StorageService'],
})
export class StorageModule {}