import { Role as PrismaRole } from '../../../../../generated/prisma/client';
import { Role } from '../../domain/entities/role.entity';

// Convierte registros generados por Prisma en entidades de dominio. Asi el
// resto del modulo trabaja con Role y no queda acoplado al tipo emitido por ORM.
export class RoleMapper {
  static toDomain(role: PrismaRole): Role {
    return new Role(
      role.id,
      role.name,
      role.description,
      role.isActive,
      role.createdAt,
      role.updatedAt,
    );
  }
}
