import { SetMetadata } from '@nestjs/common';

import { SystemRole } from '../enums/system-role.enum';

// Clave de metadata que identifica restricciones directas por rol.
export const ROLES_KEY = 'roles';

// Decorador para casos donde una ruta debe aceptar roles concretos, sin pasar
// por un permiso funcional. Es util para operaciones estrictamente
// administrativas o endpoints personales como /dashboard/patient/me.
/**
 * Ejecuta la operación roles.
 * @param roles Valor de roles requerido por la operacion.
 * @returns Resultado producido por la operación.
 */
/**
 * Ejecuta la operación roles.
 * @param roles Valor de roles requerido por la operacion.
 * @returns Resultado producido por la operación.
 */
export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES_KEY, roles);
