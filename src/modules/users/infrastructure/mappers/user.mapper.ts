import { User as PrismaUser } from '../../../../../generated/prisma/client';
import { User as DomainUser } from '../../domain/entities/user';

// Aisla al dominio de la forma exacta que devuelve Prisma.
export class UserMapper {
  static toDomain(prismaUser: PrismaUser): DomainUser {
    return DomainUser.create({
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
