import { SetMetadata } from '@nestjs/common';

import { SystemRole } from '../enums/system-role.enum';

// Clave de metadata que identifica restricciones directas por rol.
export const ROLES_KEY = 'roles';

// Decorador para casos donde una ruta debe aceptar roles concretos, sin pasar
// por un permiso funcional. Es util para operaciones estrictamente
// administrativas o endpoints personales como /dashboard/patient/me.
export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES_KEY, roles);
