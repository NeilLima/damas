/* eslint-disable prettier/prettier */
import { FilterOptions } from '../interfaces/query-options.interface';

/**
 * Classe utilitária para construção de consultas dinâmicas
 */
export class QueryBuilder {
  /**
   * Constrói um filtro para consultas baseado em parâmetros
   * @param params Parâmetros da requisição
   * @returns Objeto de filtro para uso em repositórios
   */
  static buildFilter(params: Record<string, any>): FilterOptions {
    const filter: FilterOptions = {};
    
    // Remover parâmetros de paginação e ordenação
    const { page, limit, sort, ...queryParams } = params;
    
    // Processar cada parâmetro
    Object.keys(queryParams).forEach(key => {
      const value = queryParams[key];
      
      // Ignorar valores vazios
      if (value === undefined || value === null || value === '') {
        return;
      }
      
      // Identificar operadores especiais pelo formato: campo__operador
      if (key.includes('__')) {
        const [field, operator] = key.split('__');
        
        switch (operator) {
          // Operador de igualdade (padrão)
          case 'eq':
            filter[field] = value;
            break;
            
          // Operador de diferença
          case 'ne':
            filter[field] = { $ne: value };
            break;
            
          // Operadores de comparação
          case 'gt':
            filter[field] = { ...filter[field], $gt: value };
            break;
          case 'gte':
            filter[field] = { ...filter[field], $gte: value };
            break;
          case 'lt':
            filter[field] = { ...filter[field], $lt: value };
            break;
          case 'lte':
            filter[field] = { ...filter[field], $lte: value };
            break;
            
          // Operador de contém (case-insensitive)
          case 'contains':
            filter[field] = { $regex: value, $options: 'i' };
            break;
            
          // Operador dentro de lista
          case 'in':
            const inValues = Array.isArray(value) ? value : value.split(',');
            filter[field] = { $in: inValues };
            break;
            
          // Operador fora da lista
          case 'nin':
            const ninValues = Array.isArray(value) ? value : value.split(',');
            filter[field] = { $nin: ninValues };
            break;
            
          // Operador de existência
          case 'exists':
            filter[field] = { $exists: value === 'true' };
            break;
            
          // Data entre intervalo
          case 'between':
            if (Array.isArray(value) && value.length === 2) {
              filter[field] = { 
                $gte: new Date(value[0]), 
                $lte: new Date(value[1]) 
              };
            }
            break;
        }
      } else {
        // Sem operador, usa igualdade
        filter[key] = value;
      }
    });
    
    return filter;
  }

  /**
   * Constrói um objeto de atualização para uso em operações de update
   * @param data Dados a serem atualizados
   * @returns Objeto de atualização formatado
   */
  static buildUpdate(data: Record<string, any>): Record<string, any> {
    // Para manter a compatibilidade com o funcionamento existente,
    // simplesmente retornamos o objeto de dados como é
    return data;
  }
} 