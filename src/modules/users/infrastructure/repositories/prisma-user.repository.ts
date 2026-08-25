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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   */
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Crea un usuario con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async create(data: CreateUserData): Promise<User> {
    const roleName = data.role ?? DEFAULT_ROLE_NAME;
    const role = await this.prisma.role.findFirstOrThrow({
      where: { name: roleName, isActive: true },
    });

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: { connect: { id: role.id } },
        isActive: data.isActive,
      },
      include: {
        role: true,
      },
    });

    return UserMapper.toDomain(user);
  }
  /**
   * Obtiene by email.
   * @param email Valor de email requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }
  /**
   * Obtiene by email except id.
   * @param email Valor de email requerido por la operacion.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
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
  /**
   * Actualiza un usuario existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async update(id: number, data: UpdateUserData): Promise<User> {
    const role = data.role
      ? await this.prisma.role.findFirstOrThrow({
          where: { name: data.role, isActive: true },
        })
      : undefined;
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: role ? { connect: { id: role.id } } : undefined,
        isActive: data.isActive,
      },
      include: {
        role: true,
      },
    });

    return UserMapper.toDomain(user);
  }
  /**
   * Ejecuta la operación soft delete.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
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

  /**
   * Obtiene el listado de usuarios que cumplen los filtros indicados.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
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

  /**
   * Obtiene un usuario por su identificador.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }
}
