import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import { CreateReminderDto } from '../../application/dtos/create-reminder.dto';
import { UpdateReminderDto } from '../../application/dtos/update-reminder.dto';
import { FindRemindersDto } from '../../application/dtos/find-reminders.dto';
import { ReminderEntity } from '../../domain/entities/reminder.entity';
import type {
  RemindersRepository,
  RemindersPaginatedResponse,
} from '../../domain/interfaces/reminders.repository.interface';
import { ReminderMapper } from '../mappers/reminder.mapper';
@Injectable()
export class PrismaRemindersRepository implements RemindersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  async create(data: CreateReminderDto): Promise<ReminderEntity> {
    return this.prisma.$transaction(
      async (tx) => {
        await this.access.assert(data.patientId, 'reminders', tx);
        const item = await tx.prescriptionItem.findUnique({
          where: { id: data.prescriptionItemId },
          include: { prescription: true },
        });
        if (
          !item?.isActive ||
          item.prescription.status !== 'ACTIVO' ||
          item.prescription.patientId !== data.patientId ||
          !item.scheduledTimes.includes(data.scheduledTime)
        )
          throw new BadRequestException(
            'El horario debe estar indicado en una prescripcion activa del paciente.',
          );
        if (data.daysOfWeek)
          throw new BadRequestException(
            'Los dias clinicos se modifican en la prescripcion.',
          );
        if (
          await tx.reminder.findFirst({
            where: {
              prescriptionItemId: item.id,
              scheduledTime: data.scheduledTime,
            },
          })
        )
          throw new ConflictException(
            'El recordatorio ya existe; modifica sus preferencias.',
          );
        const result = await tx.reminder.create({
          data: {
            patientId: data.patientId,
            prescriptionItemId: item.id,
            scheduledTime: data.scheduledTime,
            isActive: data.isActive ?? true,
            advanceMinutes: data.advanceMinutes,
            repeatMinutes: data.repeatMinutes,
            repeatCount: data.repeatCount,
            notifyCaregiver: data.notifyCaregiver,
          },
        });
        return ReminderMapper.fromPrisma(result);
      },
      { isolationLevel: 'Serializable' },
    );
  }
  async findAll(
    filters: FindRemindersDto,
  ): Promise<RemindersPaginatedResponse> {
    const page = filters.page ?? 1,
      limit = Math.min(filters.limit ?? 10, 100);
    const where: Prisma.ReminderWhereInput = {
      patient: await this.access.patientWhere(),
      patientId: filters.patientId,
      prescriptionItemId: filters.prescriptionItemId,
      scheduledTime: filters.scheduledTime,
      isActive: filters.isActive,
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.reminder.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reminder.count({ where }),
    ]);
    return {
      data: rows.map(ReminderMapper.fromPrisma),
      meta: { total, page, limit, lastPage: Math.ceil(total / limit) },
    };
  }
  async findById(id: number): Promise<ReminderEntity | null> {
    await this.access.resource('reminder', id);
    const row = await this.prisma.reminder.findUnique({ where: { id } });
    return row ? ReminderMapper.fromPrisma(row) : null;
  }
  async update(id: number, data: UpdateReminderDto): Promise<ReminderEntity> {
    return this.prisma.$transaction(
      async (tx) => {
        const old = await tx.reminder.findUnique({ where: { id } });
        if (!old) throw new NotFoundException();
        await this.access.assert(old.patientId, 'reminders', tx);
        if (
          (data.patientId !== undefined && data.patientId !== old.patientId) ||
          (data.prescriptionItemId !== undefined &&
            data.prescriptionItemId !== old.prescriptionItemId) ||
          (data.scheduledTime !== undefined &&
            data.scheduledTime !== old.scheduledTime) ||
          (data.daysOfWeek !== undefined && data.daysOfWeek !== old.daysOfWeek)
        )
          throw new BadRequestException(
            'Solo se pueden cambiar preferencias; los horarios pertenecen a la prescripcion.',
          );
        if (
          (data.repeatCount ?? old.repeatCount) > 0 &&
          !(data.repeatMinutes ?? old.repeatMinutes)
        )
          throw new BadRequestException('La repeticion requiere un intervalo.');
        const preferences = {
          isActive: data.isActive,
          advanceMinutes: data.advanceMinutes,
          repeatMinutes: data.repeatMinutes,
          repeatCount: data.repeatCount,
          notifyCaregiver: data.notifyCaregiver,
        };
        if (
          Object.entries(preferences).every(
            ([key, value]) =>
              value === undefined || value === old[key as keyof typeof old],
          )
        )
          return ReminderMapper.fromPrisma(old);
        const row = await tx.reminder.update({
          where: { id },
          data: {
            isActive: data.isActive,
            advanceMinutes: data.advanceMinutes,
            repeatMinutes: data.repeatMinutes,
            repeatCount: data.repeatCount,
            notifyCaregiver: data.notifyCaregiver,
          },
        });
        await tx.notification.updateMany({
          where: { intake: { reminderId: id }, status: 'PENDIENTE' },
          data: { cancelledAt: new Date() },
        });
        await tx.auditLog.create({
          data: {
            userId: this.access.actor().id,
            module: 'reminders',
            action: 'PREFERENCES',
            entityName: 'Reminder',
            entityId: id,
            description: JSON.stringify({ before: old, after: row }),
          },
        });
        return ReminderMapper.fromPrisma(row);
      },
      { isolationLevel: 'Serializable' },
    );
  }
  async delete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }
}
