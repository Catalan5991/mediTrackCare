import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '../../domain/entities/role.entity';
import {
  CreateRoleData,
  FindRolesParams,
  PaginatedRoles,
  RolesRepository,
  UpdateRoleData,
} from '../../domain/interfaces/roles.repository.interface';
import { RoleMapper } from '../mappers/role.mapper';

@Injectable()
export class PrismaRolesRepository implements RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleData): Promise<Role> {
    // Persiste el rol con los campos definidos en Prisma y devuelve una entidad
    // de dominio para mantener aislado al resto del modulo.
    const role = await this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return RoleMapper.toDomain(role);
  }

  async findAll(params: FindRolesParams): Promise<PaginatedRoles> {
    // Centraliza los valores por defecto de paginacion para que el contrato de
    // listado sea estable sin importar que parametros envie el cliente.
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    // Construye filtros dinamicos. Solo se agregan condiciones cuando el query
    // param fue enviado, permitiendo combinar busqueda textual y estado activo.
    const where: Prisma.RoleWhereInput = {
      ...(params.isActive !== undefined && {
        isActive: params.isActive,
      }),
      ...(params.search && {
        OR: [
          {
            name: {
              contains: params.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: params.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    // Conteo y listado comparten el mismo where dentro de una transaccion para
    // devolver metadatos de paginacion coherentes.
    const [total, roles] = await this.prisma.$transaction([
      this.prisma.role.count({ where }),
      this.prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data: roles.map(RoleMapper.toDomain),
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Role | null> {
    // Consulta por llave primaria para detalle, actualizacion y borrado logico.
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) return null;

    return RoleMapper.toDomain(role);
  }

  async findByName(name: string): Promise<Role | null> {
    // Usa el indice unico name definido en schema.prisma para detectar choques.
    const role = await this.prisma.role.findUnique({
      where: { name },
    });

    if (!role) return null;

    return RoleMapper.toDomain(role);
  }

  async findByNameExceptId(name: string, id: number): Promise<Role | null> {
    // Busca otro registro con el mismo nombre durante actualizaciones. Excluir
    // el id actual permite conservar el nombre sin disparar falso duplicado.
    const role = await this.prisma.role.findFirst({
      where: {
        name,
        NOT: {
          id,
        },
      },
    });

    if (!role) return null;

    return RoleMapper.toDomain(role);
  }

  async update(id: number, data: UpdateRoleData): Promise<Role> {
    // Prisma ignora undefined, por eso el mismo objeto funciona para PATCH sin
    // armar manualmente solo los campos enviados.
    const role = await this.prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
    });

    return RoleMapper.toDomain(role);
  }

  async softDelete(id: number): Promise<Role> {
    // Borrado logico: desactiva el rol para preservar historial y relaciones
    // existentes con usuarios.
    const role = await this.prisma.role.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return RoleMapper.toDomain(role);
  }
}
