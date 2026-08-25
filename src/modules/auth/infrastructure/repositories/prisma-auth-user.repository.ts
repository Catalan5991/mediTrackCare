import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { AuthUser } from '../../domain/entities/auth-user';
import type {
  AuthUserRepository,
  CreateAuthUserData,
} from '../../domain/interfaces/auth-user-repository.interface';
import { AuthUserMapper } from '../mappers/auth-user.mapper';

const DEFAULT_ROLE_NAME = 'PATIENT';

@Injectable()
// Adaptador Prisma del puerto AuthUserRepository.
export class PrismaAuthUserRepository implements AuthUserRepository {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   */
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Crea un usuario autenticado con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async create(data: CreateAuthUserData): Promise<AuthUser> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: {
          connectOrCreate: {
            where: { name: DEFAULT_ROLE_NAME },
            create: { name: DEFAULT_ROLE_NAME },
          },
        },
      },
      include: {
        role: true,
      },
    });

    return AuthUserMapper.toDomain(user);
  }
  /**
   * Obtiene by email.
   * @param email Valor de email requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    return user ? AuthUserMapper.toDomain(user) : null;
  }

  /**
   * Obtiene un usuario autenticado por su identificador.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findById(id: number): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    return user ? AuthUserMapper.toDomain(user) : null;
  }
}
