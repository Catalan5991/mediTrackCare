import { Prisma } from '../../../../../generated/prisma/client';
import { AuthUser } from '../../domain/entities/auth-user';

type PrismaUserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

// Convierte registros de Prisma en entidades de dominio para aislar la capa de datos.
export class AuthUserMapper {
  static toDomain(prismaUser: PrismaUserWithRole): AuthUser {
    return AuthUser.create({
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
