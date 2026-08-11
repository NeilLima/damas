/* eslint-disable prettier/prettier */
// Módulos
export * from './core.module';
export * from './storage/storage.module';

// Interfaces Base
export * from './base/interfaces/entity.interface';
export * from './base/interfaces/repository.interface';
export * from './base/interfaces/crud.interface';
export * from './base/interfaces/query-options.interface';

// Implementações Base
export * from './base/implementations/base.repository';
export * from './base/implementations/base.service';
export * from './base/implementations/base.controller';

// Decoradores
export * from './base/decorators/crud.decorator';
export * from './storage/decorators/upload.decorator';

// Utilitários
export * from './base/utils/query.builder';
export * from './base/utils/response.builder';
export * from '../config/id-formatter.config';

// Serviços de Armazenamento
export * from './storage/interfaces/storage.interface';
export * from './storage/implementations/local.storage'; 