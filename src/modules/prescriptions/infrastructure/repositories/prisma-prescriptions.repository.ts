import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { localDate } from '../../domain/schedule';
import { createHash } from 'node:crypto';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import type {
  CreatePrescriptionInput,
  FindPrescriptionsFilters,
  PaginatedPrescriptions,
  PrescriptionRepository,
  UpdatePrescriptionInput,
  PrescriptionItemInput,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { PrismaPrescriptionMapper } from '../mappers/prisma-prescription.mapper';
@Injectable()
export class PrismaPrescriptionsRepository implements PrescriptionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  private async itemData(
    tx: Prisma.TransactionClient,
    items: PrescriptionItemInput[],
    start: Date,
    end: Date | null | undefined,
    zone: string,
  ) {
    if (!items.length || items.length > 100)
      throw new BadRequestException(
        'La receta requiere entre 1 y 100 medicamentos.',
      );
    if (!Number.isFinite(start.getTime()) || (end && end < start))
      throw new BadRequestException('Vigencia de receta invalida.');
    const ids = [...new Set(items.map((i) => i.medicationId))];
    if (
      (await tx.medication.count({
        where: { id: { in: ids }, isActive: true },
      })) !== ids.length
    )
      throw new BadRequestException('Medicamento inexistente o inactivo.');
    return items.map((i) => {
      const itemStart = i.startDate ?? start,
        itemEnd = i.endDate ?? end ?? null;
      if (
        !i.dose.trim() ||
        !i.frequency.trim() ||
        /^-?0(?:\.0+)?(?:\s|$)/.test(i.dose) ||
        /^-\d/.test(i.dose)
      )
        throw new BadRequestException(
          'Dosis y frecuencia deben ser validas y positivas.',
        );
      if (
        itemStart < start ||
        (itemEnd && itemEnd < itemStart) ||
        (end && (!itemEnd || itemEnd > end))
      )
        throw new BadRequestException(
          'Vigencia del medicamento fuera de la receta.',
        );
      const timeZone = i.timeZone ?? zone;
      try {
        new Intl.DateTimeFormat('en', { timeZone }).format();
      } catch {
        throw new BadRequestException('Zona horaria invalida.');
      }
      const times = i.scheduledTimes ?? [];
      if (
        times.length > 24 ||
        times.some((t) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) ||
        new Set(times).size !== times.length
      )
        throw new BadRequestException('Horarios invalidos o duplicados.');
      if (
        (i.daysOfWeek ?? []).some((d) => !Number.isInteger(d) || d < 0 || d > 6)
      )
        throw new BadRequestException('Dias de semana invalidos.');
      return {
        medicationId: i.medicationId,
        dose: i.dose.trim(),
        doseUnit: i.doseUnit,
        frequency: i.frequency.trim(),
        instructions: i.instructions,
        startDate: itemStart,
        endDate: itemEnd,
        scheduledTimes: times,
        daysOfWeek: i.daysOfWeek ?? [],
        timeZone,
        quantity: i.quantity,
        duration: i.duration,
      };
    });
  }
  async create(data: CreatePrescriptionInput): Promise<PrescriptionEntity> {
    return this.prisma.$transaction(
      async (tx) => {
        const doctorId = await this.access.clinicalDoctor(
          data.patientId,
          data.doctorId,
          tx,
        );
        const canonical = (value: unknown): unknown =>
          value instanceof Date
            ? value.toISOString()
            : Array.isArray(value)
              ? value.map(canonical)
              : value && typeof value === 'object'
                ? Object.fromEntries(
                    Object.entries(value)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([key, val]) => [key, canonical(val)]),
                  )
                : value;
        const requestHash = createHash('sha256')
          .update(
            JSON.stringify(canonical({ ...data, idempotencyKey: undefined })),
          )
          .digest('hex');
        if (data.idempotencyKey) {
          const previous = await tx.prescription.findUnique({
            where: { creationKey: data.idempotencyKey },
            include: { items: { include: { medication: true } } },
          });
          if (previous) {
            if (
              previous.patientId !== data.patientId ||
              previous.doctorId !== doctorId ||
              previous.requestHash !== requestHash
            )
              throw new ConflictException(
                'La clave de idempotencia ya fue usada con otros datos.',
              );
            return PrismaPrescriptionMapper.toDomain(previous);
          }
        }
        const patient = await tx.patient.findUniqueOrThrow({
          where: { id: data.patientId },
        });
        const start =
          data.issueDate ??
          new Date(localDate(new Date(), patient.timeZone) + 'T00:00:00Z');
        const items = await this.itemData(
          tx,
          data.items,
          start,
          data.expirationDate,
          patient.timeZone,
        );
        const result = await tx.prescription.create({
          data: {
            patientId: data.patientId,
            creationKey: data.idempotencyKey,
            requestHash,
            doctorId,
            diagnosis: data.diagnosis,
            notes: data.generalInstructions,
            startDate: start,
            endDate: data.expirationDate,
            items: { create: items },
          },
          include: { items: { include: { medication: true } } },
        });
        // Preferencias iniciales; el horario clinico sigue perteneciendo al item.
        for (const item of result.items)
          if (item.scheduledTimes.length)
            await tx.reminder.createMany({
              data: item.scheduledTimes.map((scheduledTime) => ({
                patientId: data.patientId,
                prescriptionItemId: item.id,
                scheduledTime,
                isActive: true,
              })),
            });
        await tx.auditLog.create({
          data: {
            userId: this.access.actor().id,
            module: 'prescriptions',
            action: 'CREATE',
            entityName: 'Prescription',
            entityId: result.id,
            description: JSON.stringify(result),
          },
        });
        return PrismaPrescriptionMapper.toDomain(result);
      },
      { isolationLevel: 'Serializable' },
    );
  }
  async findAll(
    filters: FindPrescriptionsFilters,
  ): Promise<PaginatedPrescriptions> {
    const page = filters.page ?? 1,
      limit = Math.min(filters.limit ?? 10, 100);
    const where: Prisma.PrescriptionWhereInput = {
      patient: await this.access.patientWhere(),
      patientId: filters.patientId,
      doctorId: filters.doctorId,
      status: filters.status,
      OR: filters.search
        ? [
            { diagnosis: { contains: filters.search, mode: 'insensitive' } },
            { notes: { contains: filters.search, mode: 'insensitive' } },
          ]
        : undefined,
    };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.prescription.count({ where }),
      this.prisma.prescription.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { medication: true } } },
      }),
    ]);
    return {
      data: rows.map(PrismaPrescriptionMapper.toDomain),
      total,
      page,
      limit,
    };
  }
  async findById(id: number): Promise<PrescriptionEntity | null> {
    await this.access.resource('prescription', id);
    const row = await this.prisma.prescription.findUnique({
      where: { id },
      include: { items: { include: { medication: true } } },
    });
    return row ? PrismaPrescriptionMapper.toDomain(row) : null;
  }
  async update(
    id: number,
    data: UpdatePrescriptionInput,
  ): Promise<PrescriptionEntity> {
    return this.prisma.$transaction(
      async (tx) => {
        const current = await tx.prescription.findUnique({
          where: { id },
          include: { items: true, patient: true },
        });
        if (!current) throw new NotFoundException();
        const administrativeClose =
          this.access.actor().role.toUpperCase() === 'ADMIN' &&
          ['CANCELADO', 'FINALIZADO'].includes(data.status ?? '') &&
          Object.entries(data)
            .filter(([, value]) => value !== undefined)
            .every(([key]) => key === 'status');
        if (administrativeClose)
          await this.access.assert(current.patientId, 'clinical', tx);
        else
          await this.access.clinicalDoctor(
            current.patientId,
            current.doctorId ?? undefined,
            tx,
          );
        if (
          (data.patientId !== undefined &&
            data.patientId !== current.patientId) ||
          (data.doctorId !== undefined && data.doctorId !== current.doctorId)
        )
          throw new BadRequestException(
            'No se puede transferir una receta a otro paciente o medico.',
          );
        const start = data.issueDate ?? current.startDate,
          end = data.expirationDate ?? current.endDate;
        if (end && end < start)
          throw new BadRequestException('Vigencia invalida.');
        if ((data.issueDate || data.expirationDate) && !data.items)
          throw new BadRequestException(
            'Para cambiar vigencia envia una nueva version de los medicamentos.',
          );
        if (data.items) {
          const items = await this.itemData(
            tx,
            data.items,
            start,
            end,
            current.patient.timeZone,
          );
          await tx.prescriptionItem.updateMany({
            where: { prescriptionId: id, isActive: true },
            data: { isActive: false, retiredAt: new Date() },
          });
          await tx.reminder.updateMany({
            where: { prescriptionItem: { prescriptionId: id } },
            data: { isActive: false },
          });
          await tx.prescriptionItem.createMany({
            data: items.map((i) => ({
              ...i,
              prescriptionId: id,
              effectiveFrom: new Date(),
            })),
          });
        }
        // Cancelar solo ocurrencias futuras sin confirmar; el historial permanece intacto.
        if (
          data.items ||
          (data.status && data.status !== 'ACTIVO') ||
          data.issueDate ||
          data.expirationDate
        ) {
          await tx.intake.updateMany({
            where: {
              prescriptionItem: { prescriptionId: id },
              status: { in: ['PENDIENTE', 'RETRASADA'] },
              scheduledAt: { gte: new Date() },
            },
            data: { status: 'CANCELADA' },
          });
          await tx.notification.updateMany({
            where: {
              intake: { prescriptionItem: { prescriptionId: id } },
              status: 'PENDIENTE',
            },
            data: { cancelledAt: new Date() },
          });
        }
        if (data.status && data.status !== 'ACTIVO') {
          await tx.prescriptionItem.updateMany({
            where: { prescriptionId: id, isActive: true },
            data: { isActive: false, retiredAt: new Date() },
          });
          await tx.reminder.updateMany({
            where: { prescriptionItem: { prescriptionId: id } },
            data: { isActive: false },
          });
        }
        if (
          data.status === 'ACTIVO' &&
          !data.items &&
          current.status !== 'ACTIVO'
        )
          throw new BadRequestException(
            'La reactivacion requiere una nueva version de los medicamentos.',
          );
        const result = await tx.prescription.update({
          where: { id },
          data: {
            diagnosis: data.diagnosis,
            notes: data.generalInstructions,
            startDate: data.issueDate,
            endDate: data.expirationDate,
            status: data.status,
          },
          include: { items: { include: { medication: true } } },
        });
        if (data.items)
          for (const item of result.items.filter((i) => i.isActive))
            if (item.scheduledTimes.length)
              await tx.reminder.createMany({
                data: item.scheduledTimes.map((scheduledTime) => ({
                  patientId: current.patientId,
                  prescriptionItemId: item.id,
                  scheduledTime,
                })),
              });
        await tx.auditLog.create({
          data: {
            userId: this.access.actor().id,
            module: 'prescriptions',
            action: 'UPDATE',
            entityName: 'Prescription',
            entityId: id,
            description: JSON.stringify({ before: current, after: result }),
          },
        });
        return PrismaPrescriptionMapper.toDomain(result);
      },
      { isolationLevel: 'Serializable' },
    );
  }
  async delete(id: number): Promise<void> {
    this.access.admin();
    await this.update(id, { status: 'CANCELADO' });
  }
}
