import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateReminderDto } from '../../application/dtos/create-reminder.dto';
import { FindRemindersDto } from '../../application/dtos/find-reminders.dto';
import { UpdateReminderDto } from '../../application/dtos/update-reminder.dto';
import { ReminderEntity } from '../../domain/entities/reminder.entity';
import {
  RemindersPaginatedResponse,
  RemindersRepository,
} from '../../domain/interfaces/reminders.repository.interface';
import { ReminderMapper } from '../mappers/reminder.mapper';

@Injectable()
// Implementacion del contrato de repositorio usando Prisma como fuente de datos.
export class PrismaRemindersRepository implements RemindersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReminderDto): Promise<ReminderEntity> {
    try {
      const reminder = await this.prisma.reminder.create({
        data: {
          patientId: data.patientId,
          prescriptionItemId: data.prescriptionItemId,
          scheduledTime: data.scheduledTime,
          daysOfWeek: data.daysOfWeek ?? null,
          isActive: data.isActive ?? true,
        },
      });

      return ReminderMapper.fromPrisma(reminder);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(
    filters: FindRemindersDto,
  ): Promise<RemindersPaginatedResponse> {
    // Paginacion basada en page/limit para mantener estable la respuesta.
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ReminderWhereInput = {};

    // Construye el where incrementalmente solo con filtros presentes.
    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.prescriptionItemId) {
      where.prescriptionItemId = filters.prescriptionItemId;
    }

    if (filters.scheduledTime) {
      where.scheduledTime = filters.scheduledTime;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // Consulta y conteo via transaccion para que ambos usen el mismo filtro.
    const [reminders, total] = await this.prisma.$transaction([
      this.prisma.reminder.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.reminder.count({
        where,
      }),
    ]);

    return {
      data: reminders.map(ReminderMapper.fromPrisma),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<ReminderEntity | null> {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id },
    });

    if (!reminder) {
      return null;
    }

    return ReminderMapper.fromPrisma(reminder);
  }

  async update(
    id: number,
    data: UpdateReminderDto,
  ): Promise<ReminderEntity> {
    try {
      // Evita enviar campos undefined para no sobrescribir datos existentes.
      const updateData: Prisma.ReminderUncheckedUpdateInput = {};

      if (data.patientId !== undefined) {
        updateData.patientId = data.patientId;
      }

      if (data.prescriptionItemId !== undefined) {
        updateData.prescriptionItemId = data.prescriptionItemId;
      }

      if (data.scheduledTime !== undefined) {
        updateData.scheduledTime = data.scheduledTime;
      }

      if (data.daysOfWeek !== undefined) {
        updateData.daysOfWeek = data.daysOfWeek;
      }

      if (data.isActive !== undefined) {
        updateData.isActive = data.isActive;
      }

      const reminder = await this.prisma.reminder.update({
        where: { id },
        data: updateData,
      });

      return ReminderMapper.fromPrisma(reminder);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.reminder.delete({
      where: { id },
    });
  }

  private handlePrismaError(error: unknown): never {
    // Traduce errores conocidos de Prisma a excepciones HTTP entendibles.
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'No existe el paciente o item de receta relacionado con el recordatorio.',
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
