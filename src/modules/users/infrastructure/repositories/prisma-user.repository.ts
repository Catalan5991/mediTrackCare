import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateUserData,
  UpdateUserData,
  UsersRepository,
} from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user';
import { UserMapper } from '../mappers/user.mapper';

const DEFAULT_ROLE_NAME = 'PATIENT';

@Injectable()
// Adaptador Prisma que implementa el puerto de persistencia de usuarios.
export class PrismaUserRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    const roleName = data.role ?? DEFAULT_ROLE_NAME;

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: {
          connectOrCreate: {
            where: { name: roleName },
            create: { name: roleName },
          },
        },
        isActive: data.isActive,
      },
      include: {
        role: true,
      },
    });

    return UserMapper.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      // La vista administrativa muestra primero los usuarios mas recientes.
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        role: true,
      },
    });

    return users.map(UserMapper.toDomain);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmailExceptId(email: string, id: number): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id,
        },
      },
      include: {
        role: true,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
          ? {
              connectOrCreate: {
                where: { name: data.role },
                create: { name: data.role },
              },
            }
          : undefined,
        isActive: data.isActive,
      },
      include: {
        role: true,
      },
    });

    return UserMapper.toDomain(user);
  }

  async softDelete(id: number): Promise<User> {
    // Borrado logico: el registro permanece, pero deja de estar activo.
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
      include: {
        role: true,
      },
    });

    return UserMapper.toDomain(user);
  }
}
