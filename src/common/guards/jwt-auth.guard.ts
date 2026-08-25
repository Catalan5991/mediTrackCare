import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param reflector Valor de reflector requerido por la operacion.
   */
  constructor(private readonly reflector: Reflector) {
    super();
  }
  /**
   * Determina si puede activarse el recurso solicitado.
   * @param context Contexto de ejecución proporcionado por NestJS.
   * @returns Resultado producido por la operación.
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
  /**
   * Ejecuta la operación handle request.
   * @param err Valor de err requerido por la operacion.
   * @param user Valor de user requerido por la operacion.
   * @param _info Valor de  info requerido por la operacion.
   * @param _context Valor de  context requerido por la operacion.
   * @param _status Valor de  status requerido por la operacion.
   * @returns Resultado producido por la operación.
   * @throws {UnauthorizedException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Token inválido o no proporcionado');
    }

    return user as TUser;
  }
}
