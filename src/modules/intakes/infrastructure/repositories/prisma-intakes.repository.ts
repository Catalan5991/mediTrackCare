import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateIntakeDto } from '../../application/dtos/create-intake.dto';
import { FindIntakesDto } from '../../application/dtos/find-intakes.dto';
import { UpdateIntakeDto } from '../../application/dtos/update-intake.dto';
import { IntakeEntity } from '../../domain/entities/intake.entity';
import {
  IntakesPaginatedResponse,
  IntakesRepository,
} from '../../domain/interfaces/intakes.repository.interface';
import { IntakeMapper } from '../mappers/intake.mapper';

@Injectable()
// Implementacion del contrato de repositorio usando Prisma como fuente de datos.
export class PrismaIntakesRepository implements IntakesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateIntakeDto): Promise<IntakeEntity> {
    try {
      const intake = await this.prisma.intake.create({
        data: {
          patientId: data.patientId,
          prescriptionItemId: data.prescriptionItemId,
          reminderId: data.reminderId ?? null,
          confirmedByUserId: data.confirmedByUserId ?? null,
          scheduledAt: new Date(data.scheduledAt),
          takenAt: data.takenAt ? new Date(data.takenAt) : null,
          status: data.status,
          notes: data.notes ?? null,
        },
      });

      return IntakeMapper.fromPrisma(intake);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: FindIntakesDto): Promise<IntakesPaginatedResponse> {
    // Paginacion basada en page/limit para mantener estable la respuesta.
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.IntakeWhereInput = {};

    // Construye el where incrementalmente solo con filtros presentes.
    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.prescriptionItemId) {
      where.prescriptionItemId = filters.prescriptionItemId;
    }

    if (filters.reminderId) {
      where.reminderId = filters.reminderId;
    }

    if (filters.confirmedByUserId) {
      where.confirmedByUserId = filters.confirmedByUserId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.scheduledAt = {};

      if (filters.dateFrom) {
        where.scheduledAt.gte = new Date(filters.dateFrom);
      }

      if (filters.dateTo) {
        where.scheduledAt.lte = new Date(filters.dateTo);
      }
    }

    // Consulta y conteo via transaccion para que ambos usen el mismo filtro.
    const [intakes, total] = await this.prisma.$transaction([
      this.prisma.intake.findMany({
        where,
        orderBy: {
          scheduledAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.intake.count({
        where,
      }),
    ]);

    return {
      data: intakes.map(IntakeMapper.fromPrisma),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<IntakeEntity | null> {
    const intake = await this.prisma.intake.findUnique({
      where: { id },
    });

    if (!intake) {
      return null;
    }

    return IntakeMapper.fromPrisma(intake);
  }

  async update(id: number, data: UpdateIntakeDto): Promise<IntakeEntity> {
    try {
      // Evita enviar campos undefined para no sobrescribir datos existentes.
      const updateData: Prisma.IntakeUncheckedUpdateInput = {};

      if (data.patientId !== undefined) {
        updateData.patientId = data.patientId;
      }

      if (data.prescriptionItemId !== undefined) {
        updateData.prescriptionItemId = data.prescriptionItemId;
      }

      if (data.reminderId !== undefined) {
        updateData.reminderId = data.reminderId;
      }

      if (data.confirmedByUserId !== undefined) {
        updateData.confirmedByUserId = data.confirmedByUserId;
      }

      if (data.scheduledAt !== undefined) {
        updateData.scheduledAt = new Date(data.scheduledAt);
      }

      if (data.takenAt !== undefined) {
        updateData.takenAt = new Date(data.takenAt);
      }

      if (data.status !== undefined) {
        updateData.status = data.status;
      }

      if (data.notes !== undefined) {
        updateData.notes = data.notes;
      }

      const intake = await this.prisma.intake.update({
        where: { id },
        data: updateData,
      });

      return IntakeMapper.fromPrisma(intake);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.intake.delete({
      where: { id },
    });
  }

  private handlePrismaError(error: unknown): never {
    // Traduce errores conocidos de Prisma a excepciones HTTP entendibles.
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'No existe el paciente, item de receta, recordatorio o usuario relacionado con la toma.',
        );
      }

      if (error.code === 'P2025') {
        throw new BadRequestException(
          'No se pudo completar la operacion porque el registro no existe.',
        );
      }
    }

    throw error;
  }
}
