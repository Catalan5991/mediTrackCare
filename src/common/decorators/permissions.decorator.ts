import { SetMetadata } from '@nestjs/common';

import { Permission } from '../enums/permission.enum';

// Clave de metadata que Nest guarda en handlers/classes cuando se usa
// @Permissions(). RolesGuard la lee con Reflector en tiempo de ejecucion.
export const PERMISSIONS_KEY = 'permissions';

// Decorador declarativo para proteger endpoints por accion funcional.
// Ejemplo: @Permissions(Permission.REGISTER_MEASUREMENTS)
// A diferencia de @Roles(), este decorador no pregunta "que rol eres", sino
// "puede tu rol realizar esta accion segun la matriz de permisos".
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
