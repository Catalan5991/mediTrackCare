import { Prisma } from '../../../../../generated/prisma/client';
import { User as DomainUser } from '../../domain/entities/user';

type PrismaUserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

// Aisla al dominio de la forma exacta que devuelve Prisma.
export class UserMapper {
  /**
   * Transforma el recurso solicitado.
   * @param prismaUser Valor de prisma user requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static toDomain(prismaUser: PrismaUserWithRole): DomainUser {
    return DomainUser.create({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      role: prismaUser.role.name,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}
