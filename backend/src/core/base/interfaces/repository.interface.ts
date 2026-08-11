/* eslint-disable prettier/prettier */
import { BaseEntity } from './entity.interface';
import { FilterOptions, QueryOptions } from './query-options.interface';

/**
 * Interface para o repositório base
 * Define métodos CRUD padrão para acesso a dados
 */
export interface BaseRepository<T extends BaseEntity> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string, options?: QueryOptions): Promise<T | null>;
  findOne(filter: FilterOptions, options?: QueryOptions): Promise<T | null>;
  findAll(filter?: FilterOptions, options?: QueryOptions): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: FilterOptions): Promise<number>;
  exists(filter: FilterOptions): Promise<boolean>;
}