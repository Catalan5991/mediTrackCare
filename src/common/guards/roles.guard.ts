import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import {
  CONFIGURABLE_ROLE_PERMISSIONS,
  ROLE_PERMISSIONS,
} from '../authorization/role-permissions';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Permission } from '../enums/permission.enum';
import { SystemRole } from '../enums/system-role.enum';

type RequestUser = {
  role?: string;
};

@Injectable()
// Guard global de autorizacion por roles y permisos.
//
// Flujo:
// 1. JwtAuthGuard valida el token y coloca request.user.
// 2. RolesGuard lee metadata de @Roles() y @Permissions().
// 3. Si hay @Roles(), valida coincidencia directa del rol.
// 4. Si hay @Permissions(), resuelve la matriz del rol y valida la accion.
//
// Si una ruta no declara @Roles ni @Permissions, no aplica restricciones extra
// sobre el JWT global. Esto evita romper endpoints existentes mientras se
// migra gradualmente cada modulo a permisos explicitos.
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Metadata definida a nivel de clase o metodo. El metodo tiene prioridad
    // cuando Nest resuelve getAllAndOverride.
    const requiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Sin metadata de autorizacion, el guard no bloquea. La autenticacion ya la
    // cubre JwtAuthGuard, registrado tambien como APP_GUARD.
    if (
      (!requiredRoles || requiredRoles.length === 0) &&
      (!requiredPermissions || requiredPermissions.length === 0)
    ) {
      return true;
    }

    // request.user viene de JwtStrategy.validate(). Si el token no era valido,
    // este guard no deberia ejecutarse con un usuario ausente.
    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const userRole = this.normalizeRole(request.user?.role);

    if (!userRole) {
      throw new ForbiddenException('El usuario autenticado no tiene rol.');
    }

    // @Roles valida acceso directo por rol. Es el camino mas simple para rutas
    // que no necesitan una accion reutilizable en la matriz.
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((role) => role === userRole);

      if (!hasRole) {
        throw new ForbiddenException(
          'No tienes permisos para acceder a este recurso.',
        );
      }
    }

    // @Permissions valida contra la matriz centralizada. Se usa cuando varias
    // rutas comparten la misma accion funcional.
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = this.resolvePermissions(userRole);
      const hasPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasPermissions) {
        throw new ForbiddenException(
          'No tienes permisos para realizar esta accion.',
        );
      }
    }

    return true;
  }

  private normalizeRole(role?: string): SystemRole | null {
    // Acepta nombres de rol desde base de datos sin depender de mayusculas.
    const normalizedRole = role?.toUpperCase();

    if (
      normalizedRole &&
      Object.values(SystemRole).includes(normalizedRole as SystemRole)
    ) {
      return normalizedRole as SystemRole;
    }

    return null;
  }

  private resolvePermissions(role: SystemRole): Permission[] {
    // Combina permisos base con permisos opcionales habilitados por ambiente.
    // Set elimina duplicados si en el futuro un permiso aparece en ambas listas.
    const basePermissions = ROLE_PERMISSIONS[role];
    const configurablePermissions = CONFIGURABLE_ROLE_PERMISSIONS[role];
    const enabledConfigurablePermissions = Object.entries(
      configurablePermissions,
    )
      .filter(([, envKey]) => this.isConfigEnabled(envKey))
      .map(([permission]) => permission as Permission);

    return [...new Set([...basePermissions, ...enabledConfigurablePermissions])];
  }

  private isConfigEnabled(envKey: string): boolean {
    // Soporta varios valores comunes para facilitar configuracion en .env,
    // Docker, CI/CD o paneles de hosting.
    const value = this.configService.get<string>(envKey);

    return ['true', '1', 'yes', 'on'].includes(value?.toLowerCase() ?? '');
  }
}
