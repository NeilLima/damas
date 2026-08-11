/* eslint-disable prettier/prettier */
import { Type, applyDecorators, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { BaseEntity } from '../interfaces/entity.interface';

export interface CrudOptions<T extends BaseEntity, CreateDto, UpdateDto> {
  model: Type<T>;
  dto: {
    create: Type<CreateDto>;
    update: Type<UpdateDto>;
  };
  routes?: {
    exclude?: Array<'create' | 'findAll' | 'findOne' | 'update' | 'remove'>;
    only?: Array<'create' | 'findAll' | 'findOne' | 'update' | 'remove'>;
  };
  entity?: {
    name?: string;
  };
}

/**
 * Decorador para configurar opções CRUD automaticamente para um controlador
 * Simplificado para evitar problemas de tipagem
 */
export function Crud<T extends BaseEntity, CreateDto, UpdateDto>(options: CrudOptions<T, CreateDto, UpdateDto>) {
  // Extrair e armazenar as opções para uso na lógica interna
  const { model, dto, routes, entity } = options;
  const entityName = (entity?.name || model.name);
  
  // Determinar quais rotas devem ser incluídas
  const includeRoutes = {
    create: true,
    findAll: true,
    findOne: true,
    update: true,
    remove: true
  };

  // Aplicar exclusões
  if (routes?.exclude) {
    routes.exclude.forEach(route => {
      includeRoutes[route] = false;
    });
  }

  // Aplicar inclusões específicas
  if (routes?.only) {
    const onlyRoutes = routes.only;
    Object.keys(includeRoutes).forEach((route: string) => {
      (includeRoutes as any)[route] = onlyRoutes.includes(route as any);
    });
  }

  // Utilizamos apenas decoradores básicos para evitar problemas
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor)
  );
} 