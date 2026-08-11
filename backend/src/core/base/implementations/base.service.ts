/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import { BaseEntity } from '../interfaces/entity.interface';
import { BaseRepository } from '../interfaces/repository.interface';
import { CrudService } from '../interfaces/crud.interface';
import { FilterOptions, QueryOptions } from '../interfaces/query-options.interface';
import { IdFormatter } from '../../../config/id-formatter.config';

/**
 * Implementação genérica de serviço CRUD
 * Pode ser estendida por qualquer módulo que precise de operações CRUD
 */
export class BaseServiceImpl<T extends BaseEntity, CreateDto, UpdateDto> 
  implements CrudService<T, CreateDto, UpdateDto> {
  
  protected readonly logger: Logger;

  constructor(
    protected readonly repository: BaseRepository<T>,
    protected readonly entityName: string,
  ) {
    this.logger = new Logger(`${entityName}Service`);
  }

  /**
   * Cria uma nova entidade
   */
  async create(createDto: CreateDto): Promise<T> {
    
    return await this.repository.create(createDto as unknown as Partial<T>);
  }

  /**
   * Busca uma entidade pelo ID
   */
  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    
    
    if (!IdFormatter.isValid(id)) {
      this.logger.error(`ID inválido: ${id}`);
      return null;
    }
    
    return await this.repository.findById(id, options);
  }

  /**
   * Busca uma entidade com base em filtros
   */
  async findOne(filter: FilterOptions, options?: QueryOptions): Promise<T | null> {
    
    return await this.repository.findOne(filter, options);
  }

  /**
   * Busca todas as entidades com base em filtros
   */
  async findAll(filter?: FilterOptions, options?: QueryOptions): Promise<T[]> {
    
    return await this.repository.findAll(filter, options);
  }

  /**
   */
  async update(id: string, updateDto: UpdateDto): Promise<T | null> {
    
    
    if (!IdFormatter.isValid(id)) {
      this.logger.error(`ID inválido: ${id}`);
      throw new Error(`ID inválido: ${id}`);
    }
    
    const exists = await this.repository.findById(id);
    if (!exists) {
      this.logger.error(`${this.entityName} com ID ${id} não encontrado`);
      throw new Error(`${this.entityName} não encontrado`);
    }
    
    return await this.repository.update(id, updateDto as unknown as Partial<T>);
  }

  /**
   * Remove uma entidade pelo ID
   */
  async remove(id: string): Promise<boolean> {
    
    
    if (!IdFormatter.isValid(id)) {
      this.logger.error(`ID inválido: ${id}`);
      return false;
    }
    
    const exists = await this.repository.findById(id);
    if (!exists) {
      this.logger.warn(`${this.entityName} com ID ${id} não encontrado`);
      return false;
    }
    
    return await this.repository.delete(id);
  }

  /**
   * Conta entidades com base em filtros
   */
  async count(filter?: FilterOptions): Promise<number> {
    
    return await this.repository.count(filter);
  }
} 