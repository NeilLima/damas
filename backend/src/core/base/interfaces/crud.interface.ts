/* eslint-disable prettier/prettier */
import { FilterOptions, QueryOptions } from './query-options.interface';

/**
 * Interface para serviços CRUD
 * Define operações padrão para manipulação de entidades
 */
export interface CrudService<T, CreateDto, UpdateDto> {
  create(createDto: CreateDto): Promise<T>;
  findById(id: string, options?: QueryOptions): Promise<T | null>;
  findOne(filter: FilterOptions, options?: QueryOptions): Promise<T | null>;
  findAll(filter?: FilterOptions, options?: QueryOptions): Promise<T[]>;
  update(id: string, updateDto: UpdateDto): Promise<T | null>;
  remove(id: string): Promise<boolean>;
  count(filter?: FilterOptions): Promise<number>;
}

/**
 * Interface para controladores CRUD
 * Define endpoints padrão para manipulação de entidades
 */
export interface CrudController<T, CreateDto, UpdateDto> {
  create(createDto: CreateDto): Promise<T>;
  findOne(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, updateDto: UpdateDto): Promise<T | null>;
  remove(id: string): Promise<void>;
}