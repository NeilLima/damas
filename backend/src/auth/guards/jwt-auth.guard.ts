/* eslint-disable prettier/prettier */
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      // Passport/JWT errors should become 401, not 500
      throw new UnauthorizedException(err?.message || 'Unauthorized');
    }

    if (!user) {
      const message = info?.message || 'Unauthorized';
      throw new UnauthorizedException(message);
    }

    return user;
  }
}
