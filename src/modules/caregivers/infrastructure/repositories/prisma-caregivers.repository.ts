import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Caregiver } from '../../domain/entities/caregiver.entity';
import {
  CaregiversRepository,
  CreateCaregiverData,
  FindCaregiversParams,
  PaginatedCaregivers,
  UpdateCaregiverData,
} from '../../domain/interfaces/caregivers.repository.interface';
import { CaregiverMapper } from '../mappers/caregiver.mapper';

@Injectable()
export class PrismaCaregiversRepository implements CaregiversRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCaregiverData): Promise<Caregiver> {
    // Persiste el vinculo usando los nombres del modelo Prisma. La conversion
    // a entidad de dominio se hace al final para no filtrar tipos del ORM.
    const caregiver = await this.prisma.caregiver.create({
      data: {
        userId: data.userId,
        patientId: data.patientId,
        relationship: data.relationship,
        isPrimary: data.isPrimary,
      },
    });

    return CaregiverMapper.toDomain(caregiver);
  }

  async findAll(params: FindCaregiversParams): Promise<PaginatedCaregivers> {
    // Normaliza paginacion aqui para que todos los consumidores del repositorio
    // obtengan el mismo comportamiento, aunque omitan page o limit.
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    // Construye un where dinamico: solo se agregan filtros cuando el parametro
    // fue enviado. Esto permite combinar busqueda, estado, paciente y usuario.
    const where: Prisma.CaregiverWhereInput = {
      ...(params.userId !== undefined && {
        userId: params.userId,
      }),
      ...(params.patientId !== undefined && {
        patientId: params.patientId,
      }),
      ...(params.isPrimary !== undefined && {
        isPrimary: params.isPrimary,
      }),
      ...(params.isActive !== undefined && {
        isActive: params.isActive,
      }),
      ...(params.search && {
        // Busqueda textual sobre el campo relationship, sin distinguir
        // mayusculas o minusculas para mejorar la experiencia de consulta.
        relationship: {
          contains: params.search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    };

    // Ejecuta conteo y listado en una transaccion para devolver metadatos de
    // paginacion coherentes con la misma condicion de busqueda.
    const [total, caregivers] = await this.prisma.$transaction([
      this.prisma.caregiver.count({ where }),
      this.prisma.caregiver.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data: caregivers.map(CaregiverMapper.toDomain),
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Caregiver | null> {
    // findUnique aprovecha la llave primaria id definida en el modelo Caregiver.
    const caregiver = await this.prisma.caregiver.findUnique({
      where: { id },
    });

    if (!caregiver) return null;

    return CaregiverMapper.toDomain(caregiver);
  }

  async findByUserAndPatient(
    userId: number,
    patientId: number,
  ): Promise<Caregiver | null> {
    // Consulta la restriccion compuesta @@unique([userId, patientId]) del
    // schema Prisma para detectar duplicados de forma directa.
    const caregiver = await this.prisma.caregiver.findUnique({
      where: {
        userId_patientId: {
          userId,
          patientId,
        },
      },
    });

    if (!caregiver) return null;

    return CaregiverMapper.toDomain(caregiver);
  }

  async update(id: number, data: UpdateCaregiverData): Promise<Caregiver> {
    // Prisma ignora valores undefined, por eso este metodo sirve para PATCH
    // sin tener que construir manualmente un objeto solo con campos presentes.
    const caregiver = await this.prisma.caregiver.update({
      where: { id },
      data: {
        userId: data.userId,
        patientId: data.patientId,
        relationship: data.relationship,
        isPrimary: data.isPrimary,
        isActive: data.isActive,
      },
    });

    return CaregiverMapper.toDomain(caregiver);
  }

  async softDelete(id: number): Promise<Caregiver> {
    // Borrado logico: conserva el registro y solo lo desactiva para mantener
    // trazabilidad de quien estuvo asociado al cuidado del paciente.
    const caregiver = await this.prisma.caregiver.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return CaregiverMapper.toDomain(caregiver);
  }
}
