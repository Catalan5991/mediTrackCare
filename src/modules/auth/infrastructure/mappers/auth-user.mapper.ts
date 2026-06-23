import { User as PrismaUser } from '../../../../../generated/prisma/client';
import { AuthUser } from '../../domain/entities/auth-user';

// Convierte registros de Prisma en entidades de dominio para aislar la capa de datos.
export class AuthUserMapper {
  static toDomain(prismaUser: PrismaUser): AuthUser {
    return AuthUser.create({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      role: prismaUser.role,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}
