/* eslint-disable prettier/prettier */
import { 
  Body, Delete, Get, HttpException,
  HttpStatus, Param, Patch, Post, Logger
} from '@nestjs/common';
import { CrudService } from '../interfaces/crud.interface';
import { BaseEntity } from '../interfaces/entity.interface';
import { IdFormatter } from '../../../config/id-formatter.config';

/**
 * Implementação genérica de controlador CRUD
 * Pode ser estendida por qualquer módulo que precise de endpoints CRUD padrão
 */
export abstract class BaseController<T extends BaseEntity, CreateDto, UpdateDto> {
  protected readonly logger: Logger;

  constructor(
    protected readonly service: CrudService<T, CreateDto, UpdateDto>,
    protected readonly entityName: string,
  ) {
    this.logger = new Logger(`${entityName}Controller`);
  }

  /**
   * Cria uma nova entidade
   * @POST /
   */
  @Post()
  async create(@Body() createDto: CreateDto): Promise<T> {
    try {
      
      return await this.service.create(createDto);
    } catch (error) {
      this.logger.error(`Erro ao criar: ${error.message}`);
      throw new HttpException(
        error.message || 'Erro ao criar registro',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Busca todas as entidades
   * @GET /
   */
  @Get()
  async findAll(): Promise<T[]> {
    try {
      
      return await this.service.findAll();
    } catch (error) {
      this.logger.error(`Erro ao buscar registros: ${error.message}`);
      throw new HttpException(
        error.message || 'Erro ao buscar registros',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Busca uma entidade por ID
   * @GET /:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    try {
      if (!IdFormatter.isValid(id)) {
        this.logger.error(`ID inválido: ${id}`);
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }
      
      
      const found = await this.service.findById(id);
      
      if (!found) {
        this.logger.warn(`Registro com ID ${id} não encontrado`);
        throw new HttpException('Registro não encontrado', HttpStatus.NOT_FOUND);
      }
      
      return found;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Erro ao buscar registro: ${error.message}`);
      throw new HttpException(
        error.message || 'Erro ao buscar registro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Atualiza uma entidade por ID
   * @PATCH /:id
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateDto): Promise<T> {
    try {
      if (!IdFormatter.isValid(id)) {
        this.logger.error(`ID inválido: ${id}`);
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }
      
      
      const updated = await this.service.update(id, updateDto);
      
      if (!updated) {
        this.logger.warn(`Registro com ID ${id} não encontrado`);
        throw new HttpException('Registro não encontrado', HttpStatus.NOT_FOUND);
      }
      
      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Erro ao atualizar registro: ${error.message}`);
      throw new HttpException(
        error.message || 'Erro ao atualizar registro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Remove uma entidade por ID
   * @DELETE /:id
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!IdFormatter.isValid(id)) {
        this.logger.error(`ID inválido: ${id}`);
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }
      
      
      const result = await this.service.remove(id);
      
      if (!result) {
        this.logger.warn(`Registro com ID ${id} não encontrado`);
        throw new HttpException('Registro não encontrado', HttpStatus.NOT_FOUND);
      }
      
      return { success: true, message: 'Registro removido com sucesso' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Erro ao remover registro: ${error.message}`);
      throw new HttpException(
        error.message || 'Erro ao remover registro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 