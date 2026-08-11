/* eslint-disable prettier/prettier */
/**
 * Interface base para todas as entidades do sistema
 * Inclui campos comuns
 */
export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}