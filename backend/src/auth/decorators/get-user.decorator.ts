/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Log para debug
    console.log('[GetUser Decorator] request.user:', request.user);
    
    // Validar se user existe
    if (!request.user) {
      console.warn('[GetUser Decorator] request.user está undefined');
      return null;
    }
    
    // Validar se userId existe
    if (!request.user.userId) {
      console.warn('[GetUser Decorator] request.user.userId está undefined. User completo:', JSON.stringify(request.user));
      // Tentar retornar outros campos possíveis
      return request.user.id || request.user.sub || null;
    }
    
    return request.user.userId;
  },
);
