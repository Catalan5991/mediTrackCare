import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, IntakeStatus } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import {
  localDate,
  occurrences,
  occurrenceKey,
} from '../../../prescriptions/domain/schedule';
import { CreateIntakeDto } from '../../application/dtos/create-intake.dto';
import { UpdateIntakeDto } from '../../application/dtos/update-intake.dto';
import { FindIntakesDto } from '../../application/dtos/find-intakes.dto';
import { IntakeEntity } from '../../domain/entities/intake.entity';
import type {
  IntakesRepository,
  IntakesPaginatedResponse,
} from '../../domain/interfaces/intakes.repository.interface';
import { IntakeMapper } from '../mappers/intake.mapper';
@Injectable()
export class PrismaIntakesRepository implements IntakesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  private outcome(
    status: IntakeStatus,
    takenAt: string | undefined,
    scheduledAt: Date,
  ) {
    if (
      !['PENDIENTE', 'TOMADA', 'OMITIDA', 'CANCELADA', 'RETRASADA'].includes(
        status,
      )
    )
      throw new BadRequestException('Estado invalido.');
    if (status === 'OMITIDA' && scheduledAt > new Date())
      throw new BadRequestException('No se puede omitir una toma futura.');
    const actual =
      status === 'TOMADA' ? (takenAt ? new Date(takenAt) : new Date()) : null;
    if (actual && (!Number.isFinite(actual.getTime()) || actual > new Date()))
      throw new BadRequestException('La hora real no puede ser futura.');
    if (status !== 'TOMADA' && takenAt)
      throw new BadRequestException(
        'Solo una toma confirmada tiene hora de administracion.',
      );
    return actual;
  }
  async create(data: CreateIntakeDto): Promise<IntakeEntity> {
    return this.prisma.$transaction(
      async (tx) => {
        await this.access.assert(data.patientId, 'track', tx);
        const item = await tx.prescriptionItem.findUnique({
          where: { id: data.prescriptionItemId },
          include: { prescription: true, medication: true, reminders: true },
        });
        if (!item || item.prescription.patientId !== data.patientId)
          throw new BadRequestException(
            'El medicamento no pertenece al paciente.',
          );
        if (
          data.reminderId &&
          !item.reminders.some(
            (r) => r.id === data.reminderId && r.patientId === data.patientId,
          )
        )
          throw new BadRequestException('Recordatorio incompatible.');
        const scheduledAt = new Date(data.scheduledAt),
          day = localDate(scheduledAt, item.timeZone);
        if (
          !occurrences(item, day, day).some(
            (d) => d.getTime() === scheduledAt.getTime(),
          )
        )
          throw new BadRequestException(
            'La toma no corresponde a un horario prescrito activo.',
          );
        const status = data.status ?? 'PENDIENTE';
        if (!['PENDIENTE', 'TOMADA', 'OMITIDA'].includes(status))
          throw new BadRequestException('Estado de registro invalido.');
        const takenAt = this.outcome(status, data.takenAt, scheduledAt);
        const existing = await tx.intake.findFirst({
          where: { prescriptionItemId: item.id, scheduledAt },
          orderBy: { id: 'asc' },
        });
        if (existing) {
          if (existing.status === status)
            return IntakeMapper.fromPrisma(existing);
          if (!['PENDIENTE', 'RETRASADA'].includes(existing.status))
            throw new ConflictException(
              'La toma ya fue resuelta; utiliza una correccion autorizada.',
            );
          const changed = await tx.intake.updateMany({
            where: { id: existing.id, status: existing.status },
            data: {
              status,
              takenAt,
              confirmedByUserId:
                status === 'PENDIENTE' ? null : this.access.actor().id,
              notes: data.notes,
            },
          });
          if (changed.count !== 1)
            throw new ConflictException(
              'La toma fue modificada; vuelve a consultar.',
            );
          await this.audit(tx, existing.id, 'RESOLVE', {
            before: existing,
            status,
            takenAt,
          });
          return IntakeMapper.fromPrisma(
            await tx.intake.findUniqueOrThrow({ where: { id: existing.id } }),
          );
        }
        const row = await tx.intake.create({
          data: {
            patientId: data.patientId,
            prescriptionItemId: item.id,
            reminderId: data.reminderId,
            scheduledAt,
            occurrenceKey: occurrenceKey(item.id, scheduledAt),
            status,
            takenAt,
            confirmedByUserId:
              status === 'PENDIENTE' ? null : this.access.actor().id,
            notes: data.notes,
            prescriptionSnapshot: {
              medicationId: item.medicationId,
              name: item.medication.name,
              presentation: item.medication.presentation,
              concentration: item.medication.concentration,
              dose: item.dose,
              doseUnit: item.doseUnit,
              frequency: item.frequency,
              timeZone: item.timeZone,
            },
          },
        });
        await this.audit(tx, row.id, 'CREATE', { status, takenAt });
        return IntakeMapper.fromPrisma(row);
      },
      { isolationLevel: 'Serializable' },
    );
  }
  private async audit(
    tx: Prisma.TransactionClient,
    id: number,
    action: string,
    details: unknown,
  ) {
    await tx.auditLog.create({
      data: {
        userId: this.access.actor().id,
        module: 'intakes',
        action,
        entityName: 'Intake',
        entityId: id,
        description: JSON.stringify(details),
      },
    });
  }
  async update(id: number, data: UpdateIntakeDto): Promise<IntakeEntity> {
    return this.prisma.$transaction(
      async (tx) => {
        const old = await tx.intake.findUnique({ where: { id } });
        if (!old) throw new NotFoundException();
        await this.access.assert(old.patientId, 'track', tx);
        if (
          (data.patientId !== undefined && data.patientId !== old.patientId) ||
          (data.prescriptionItemId !== undefined &&
            data.prescriptionItemId !== old.prescriptionItemId) ||
          (data.reminderId !== undefined &&
            data.reminderId !== old.reminderId) ||
          (data.scheduledAt !== undefined &&
            new Date(data.scheduledAt).getTime() !== old.scheduledAt.getTime())
        )
          throw new BadRequestException(
            'No se pueden cambiar las referencias ni la hora programada de una toma.',
          );
        const status = data.status ?? old.status;
        // Una repeticion de la misma confirmacion no genera otra toma ni altera su hora real.
        if (
          status === old.status &&
          (data.notes === undefined || data.notes === old.notes) &&
          (data.takenAt === undefined ||
            new Date(data.takenAt).getTime() === old.takenAt?.getTime())
        )
          return IntakeMapper.fromPrisma(old);
        const correction =
          !['PENDIENTE', 'RETRASADA'].includes(old.status) ||
          (status !== old.status &&
            ['CANCELADA', 'RETRASADA', 'PENDIENTE'].includes(status));
        if (correction) {
          await this.access.assert(old.patientId, 'clinical', tx);
          if (!data.correctionReason?.trim())
            throw new BadRequestException(
              'La correccion requiere motivo y permisos clinicos.',
            );
        }
        if (old.status === 'CANCELADA' && status !== 'CANCELADA')
          throw new ConflictException(
            'Una toma cancelada por cambio de receta no se reactiva.',
          );
        const takenAt = this.outcome(
          status,
          data.takenAt ??
            (status === 'TOMADA' ? old.takenAt?.toISOString() : undefined),
          old.scheduledAt,
        );
        const changed = await tx.intake.updateMany({
          where: { id, updatedAt: old.updatedAt },
          data: {
            status,
            takenAt,
            confirmedByUserId: this.access.actor().id,
            notes: data.notes,
          },
        });
        if (changed.count !== 1)
          throw new ConflictException(
            'La toma fue modificada; vuelve a consultar.',
          );
        await tx.notification.updateMany({
          where: { intakeId: id, status: 'PENDIENTE' },
          data: { cancelledAt: new Date() },
        });
        await this.audit(tx, id, correction ? 'CORRECTION' : 'RESOLVE', {
          before: old,
          status,
          takenAt,
          reason: data.correctionReason,
        });
        return IntakeMapper.fromPrisma(
          await tx.intake.findUniqueOrThrow({ where: { id } }),
        );
      },
      { isolationLevel: 'Serializable' },
    );
  }
  async findAll(filters: FindIntakesDto): Promise<IntakesPaginatedResponse> {
    const page = filters.page ?? 1,
      limit = Math.min(filters.limit ?? 10, 100);
    if (
      filters.dateFrom &&
      filters.dateTo &&
      new Date(filters.dateTo) < new Date(filters.dateFrom)
    )
      throw new BadRequestException('Periodo invalido.');
    const where: Prisma.IntakeWhereInput = {
      patient: await this.access.patientWhere(),
      patientId: filters.patientId,
      prescriptionItemId: filters.prescriptionItemId,
      reminderId: filters.reminderId,
      confirmedByUserId: filters.confirmedByUserId,
      status: filters.status,
      scheduledAt: {
        gte: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
        lte: filters.dateTo ? new Date(filters.dateTo) : undefined,
      },
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.intake.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { scheduledAt: 'desc' },
      }),
      this.prisma.intake.count({ where }),
    ]);
    return {
      data: rows.map(IntakeMapper.fromPrisma),
      meta: { total, page, limit, lastPage: Math.ceil(total / limit) },
    };
  }
  async findById(id: number): Promise<IntakeEntity | null> {
    await this.access.resource('intake', id);
    const row = await this.prisma.intake.findUnique({ where: { id } });
    return row ? IntakeMapper.fromPrisma(row) : null;
  }
  async delete(id: number): Promise<void> {
    this.access.admin();
    await this.update(id, {
      status: 'CANCELADA',
      correctionReason: 'Cancelacion administrativa; se conserva el historial.',
    });
  }
}
