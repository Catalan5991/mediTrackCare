import { ROLE_PERMISSIONS } from './role-permissions';
import { Permission } from '../enums/permission.enum';
import { SystemRole } from '../enums/system-role.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UsersController } from '../../modules/users/infrastructure/controllers/users.controller';
import { RolesController } from '../../modules/roles/infrastructure/controllers/roles.controller';

describe('Homologación de roles y permisos', () => {
  it('mantiene una matriz para cada rol soportado', () => {
    expect(Object.keys(ROLE_PERMISSIONS).sort()).toEqual(
      Object.values(SystemRole).sort(),
    );
  });

  it('otorga al administrador todos los permisos declarados', () => {
    expect(new Set(ROLE_PERMISSIONS[SystemRole.ADMIN])).toEqual(
      new Set(Object.values(Permission)),
    );
  });

  it('protege la administración de usuarios y roles con su permiso funcional', () => {
    expect(Reflect.getMetadata(PERMISSIONS_KEY, UsersController)).toContain(
      Permission.MANAGE_USERS,
    );
    expect(Reflect.getMetadata(PERMISSIONS_KEY, RolesController)).toContain(
      Permission.MANAGE_ROLES,
    );
  });
});
