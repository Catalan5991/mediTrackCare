import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
// Guard global que protege rutas por defecto y respeta el decorador @Public().
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
}
