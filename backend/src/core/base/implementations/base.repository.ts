/* eslint-disable prettier/prettier */
type PopulateOptions = unknown;

interface QueryLike<R> {
  select: (value: unknown) => QueryLike<R>;
  populate: (value: unknown) => QueryLike<R>;
  skip: (value: number) => QueryLike<R>;
  limit: (value: number) => QueryLike<R>;
  sort: (value: unknown) => QueryLike<R>;
  lean: <TLean>() => QueryLike<TLean>;
  exec: () => Promise<R>;
  write: (value: unknown) => void;
  end: () => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  id?: unknown;
}

interface ModelLike<T> {
  new (data: unknown): { save: () => Promise<T> };
  findById: (id: unknown) => QueryLike<T | null>;
  findOne: (filter: unknown) => QueryLike<T | null>;
  find: (filter: unknown) => QueryLike<T[]>;
  findByIdAndUpdate: (id: unknown, update: unknown, options: unknown) => QueryLike<T | null>;
  findByIdAndDelete: (id: unknown) => QueryLike<T | null>;
  countDocuments: (filter: unknown) => QueryLike<number>;
}

import { BaseEntity } from '../interfaces/entity.interface';
import { BaseRepository } from '../interfaces/repository.interface';
import { FilterOptions, QueryOptions } from '../interfaces/query-options.interface';
import { IdFormatter } from '../../../config/id-formatter.config';
import { Logger } from '@nestjs/common';

/**
 * Implementação genérica de repositório
 * Pode ser estendida por qualquer módulo que precise de operações CRUD
 */
export class BaseRepositoryImpl<T extends BaseEntity> implements BaseRepository<T> {

  protected readonly logger: Logger;

  constructor(
    protected readonly model: ModelLike<T>,
    protected readonly entityName: string,
  ) {
    this.logger = new Logger(`${entityName}Repository`);
  }

  /**
   * Cria um novo documento
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      
      // Verificar se é necessário converter campos específicos para ObjectId
      const processedData: any = { ...data };
      
      // Converter postId para ObjectId se existir e for string
      if (processedData['postId'] && typeof processedData['postId'] === 'string') {
        processedData['postId'] = IdFormatter.toId(processedData['postId']);
        
      }

      // Converter userId para ObjectId se existir e for string
      if (processedData['userId'] && typeof processedData['userId'] === 'string') {
        processedData['userId'] = IdFormatter.toId(processedData['userId']);
        
      }
      
      // Tratamento especial para EventParticipant
      if (this.entityName === 'EventParticipant') {
        
        const entity = new this.model({
          ...processedData,
          registeredAt: new Date()
        });
        return await entity.save() as T;
      }
      
      const entity = new this.model(processedData);
      return await entity.save() as T;
    } catch (error) {
      this.logger.error(`Erro ao criar ${this.entityName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Processa as opções de populate
   */
  private processPopulate(query: any, populate: QueryOptions['populate']) {
    if (Array.isArray(populate)) {
      populate.forEach(path => {
        query = query.populate(path);
      });
    } else if (typeof populate === 'string') {
      query = query.populate(populate);
    } else if (populate && typeof populate === 'object') {
      query = query.populate(populate as any);
    }
    return query;
  }

  /**
   * Busca um documento pelo ID
   */
  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    try {
      if (!IdFormatter.isValid(id)) {
        this.logger.error(`ID inválido: ${id}`);
        return null;
      }

      
      let query = this.model.findById(IdFormatter.toId(id));
      
      if (options?.select) {
        query = query.select(options.select);
      }
      
      if (options?.populate) {
        query = this.processPopulate(query, options.populate);
      }

      const result = await query.exec();
      return result as unknown as T | null;
    } catch (error) {
      this.logger.error(`Erro ao buscar ${this.entityName} por ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca um documento com base em filtros
   */
  async findOne(filter: FilterOptions, options?: QueryOptions): Promise<T | null> {
    try {
      
      let query = this.model.findOne(filter as any);
      
      if (options?.select) {
        query = query.select(options.select);
      }
      
      if (options?.populate) {
        query = this.processPopulate(query, options.populate);
      }

      const result = await query.exec();
      return result as unknown as T | null;
    } catch (error) {
      this.logger.error(`Erro ao buscar ${this.entityName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca todos os documentos que correspondem aos filtros
   */
  async findAll(filter: FilterOptions = {}, options?: QueryOptions): Promise<T[]> {
    try {
      
      let query = this.model.find(filter as any);
      
      if (options?.skip) {
        query = query.skip(options.skip);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.sort) {
        query = query.sort(options.sort);
      }
      
      if (options?.select) {
        query = query.select(options.select);
      }
      
      if (options?.populate) {
        query = this.processPopulate(query, options.populate);
      }

      // Solucionando o problema de tipo com o lean()
      const documentsPromise = options?.lean 
        ? query.lean<T[]>().exec() 
        : query.exec();
      
      const result = await documentsPromise;
      return result as unknown as T[];
    } catch (error) {
      this.logger.error(`Erro ao buscar todos ${this.entityName}s: ${error.message}`);
      throw error;
    }
  }

  /**
   * Atualiza um documento pelo ID
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      if (!IdFormatter.isValid(id)) {
        this.logger.error(`ID inválido: ${id}`);
        throw new Error(`ID inválido: ${id}`);
      }

      
      const objectId = IdFormatter.toId(id);
      const result = await this.model.findByIdAndUpdate(
        objectId,
        { $set: data },
        { new: true }
      ).exec();
      
      return result as unknown as T;
    } catch (error) {
      this.logger.error(`Erro ao atualizar ${this.entityName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove um documento pelo ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      if (!IdFormatter.isValid(id)) {
        this.logger.error(`ID inválido: ${id}`);
        return false;
      }

      
      const objectId = IdFormatter.toId(id);
      const result = await this.model.findByIdAndDelete(objectId).exec();
      return result != null;
    } catch (error) {
      this.logger.error(`Erro ao remover ${this.entityName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Conta documentos com base em filtros
   */
  async count(filter: FilterOptions = {}): Promise<number> {
    try {
      
      return await this.model.countDocuments(filter as any).exec();
    } catch (error) {
      this.logger.error(`Erro ao contar ${this.entityName}s: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verifica se existem documentos com base em filtros
   */
  async exists(filter: FilterOptions): Promise<boolean> {
    try {
      
      const count = await this.model.countDocuments(filter as any).limit(1).exec();
      return count > 0;
    } catch (error) {
      this.logger.error(`Erro ao verificar existência de ${this.entityName}: ${error.message}`);
      throw error;
    }
  }
} 