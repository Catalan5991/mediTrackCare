import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import {
  localDate,
  localInstant,
  addDays,
  occurrences,
  occurrenceKey,
} from '../../../prescriptions/domain/schedule';
import {
  PatientAgendaDto,
  PatientMedicationsDto,
} from '../../application/dtos/patient-agenda.dto';
import type { PatientAgendaRepository } from '../../domain/interfaces/patient-agenda.repository';
@Injectable()
export class PrismaPatientAgendaRepository implements PatientAgendaRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  async activity(patientId: number, q: { page?: number; limit?: number }) {
    return this.prisma.$transaction(
      async (tx) => {
        await this.access.assert(patientId, 'read', tx);
        const [prescriptions, items, intakes, reminders] = await Promise.all([
          tx.prescription.findMany({
            where: { patientId },
            select: { id: true },
          }),
          tx.prescriptionItem.findMany({
            where: { prescription: { patientId } },
            select: { id: true },
          }),
          tx.intake.findMany({ where: { patientId }, select: { id: true } }),
          tx.reminder.findMany({ where: { patientId }, select: { id: true } }),
        ]);
        const where: Prisma.AuditLogWhereInput = {
          OR: [
            { module: 'patient-links', entityId: patientId },
            {
              module: 'prescriptions',
              entityName: 'Prescription',
              entityId: { in: prescriptions.map((p) => p.id) },
            },
            {
              module: 'intakes',
              entityName: 'Intake',
              entityId: { in: intakes.map((p) => p.id) },
            },
            {
              module: 'reminders',
              entityName: 'Reminder',
              entityId: { in: reminders.map((p) => p.id) },
            },
            {
              module: 'reminders',
              entityName: 'PrescriptionItem',
              entityId: { in: items.map((p) => p.id) },
            },
          ],
        };
        const page = q.page ?? 1,
          limit = Math.min(q.limit ?? 20, 100);
        const [total, data] = await Promise.all([
          tx.auditLog.count({ where }),
          tx.auditLog.findMany({
            where,
            select: {
              id: true,
              module: true,
              action: true,
              entityName: true,
              entityId: true,
              createdAt: true,
            },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            skip: (page - 1) * limit,
            take: limit,
          }),
        ]);
        return { data, total, page, limit };
      },
      { isolationLevel: 'RepeatableRead' },
    );
  }
  async agenda(patientId: number, q: PatientAgendaDto) {
    await this.access.assert(patientId);
    const patient = await this.prisma.patient.findUniqueOrThrow({
      where: { id: patientId },
    });
    const requested = q.date ?? localDate(new Date(), patient.timeZone);
    if (
      !Number.isFinite(Date.parse(requested + 'T00:00:00Z')) ||
      new Date(requested + 'T00:00:00Z').toISOString().slice(0, 10) !==
        requested
    )
      throw new BadRequestException('Fecha civil invalida.');
    const from =
      q.period === 'month' ? requested.slice(0, 7) + '-01' : requested;
    const until =
      q.period === 'month'
        ? new Date(
            Date.UTC(Number(from.slice(0, 4)), Number(from.slice(5, 7)), 1),
          )
            .toISOString()
            .slice(0, 10)
        : addDays(from, q.period === 'week' ? 7 : 1);
    const fromInstant = localInstant(from, '00:00', patient.timeZone),
      untilInstant = localInstant(until, '00:00', patient.timeZone);
    if (!fromInstant || !untilInstant)
      throw new BadRequestException(
        'El periodo no tiene un limite horario valido.',
      );
    const itemWhere: Prisma.PrescriptionItemWhereInput = {
      prescription: { patientId },
      id: q.prescriptionItemId,
      medicationId: q.medicationId,
    };
    const [items, persisted] = await this.prisma.$transaction([
      this.prisma.prescriptionItem.findMany({
        where: {
          ...itemWhere,
          OR: [
            { isActive: true, prescription: { patientId, status: 'ACTIVO' } },
            { retiredAt: { not: null } },
          ],
        },
        include: { prescription: true, medication: true, reminders: true },
      }),
      this.prisma.intake.findMany({
        where: {
          patientId,
          scheduledAt: { gte: fromInstant, lt: untilInstant },
          prescriptionItemId: q.prescriptionItemId,
          prescriptionItem: { medicationId: q.medicationId },
        },
        include: { prescriptionItem: { include: { medication: true } } },
        orderBy: { id: 'asc' },
      }),
    ]);
    type Entry = {
      id: number | null;
      occurrenceKey: string;
      patientId: number;
      prescriptionItemId: number;
      medication: unknown;
      dose: string;
      frequency: string;
      scheduledAt: Date;
      takenAt: Date | null;
      status: string;
      prescriptionSnapshot: unknown;
    };
    const entries = new Map<string, Entry>();
    for (const item of items)
      for (const scheduledAt of occurrences(item, addDays(from, -1), until)) {
        if (scheduledAt < fromInstant || scheduledAt >= untilInstant) continue;
        const key = occurrenceKey(item.id, scheduledAt);
        entries.set(key, {
          id: null,
          occurrenceKey: key,
          patientId,
          prescriptionItemId: item.id,
          medication: item.medication,
          dose: item.dose,
          frequency: item.frequency,
          scheduledAt,
          takenAt: null,
          status: 'PENDIENTE',
          prescriptionSnapshot: null,
        });
      }
    for (const row of persisted) {
      const key = occurrenceKey(row.prescriptionItemId, row.scheduledAt);
      entries.set(key, {
        id: row.id,
        occurrenceKey: key,
        patientId,
        prescriptionItemId: row.prescriptionItemId,
        medication: row.prescriptionItem.medication,
        dose: row.prescriptionItem.dose,
        frequency: row.prescriptionItem.frequency,
        scheduledAt: row.scheduledAt,
        takenAt: row.takenAt,
        status: row.status,
        prescriptionSnapshot: row.prescriptionSnapshot,
      });
    }
    const rows = [...entries.values()].sort(
      (a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime(),
    );
    const now = new Date();
    const summarize = (values: Entry[]) => {
      const due = values.filter(
        (r) => r.scheduledAt <= now && r.status !== 'CANCELADA',
      );
      const confirmed = due.filter((r) => r.status === 'TOMADA').length,
        omitted = due.filter((r) => r.status === 'OMITIDA').length;
      return {
        scheduled: values.length,
        due: due.length,
        confirmed,
        omitted,
        pending: due.length - confirmed - omitted,
        cancelled: values.filter((r) => r.status === 'CANCELADA').length,
        confirmedRate: due.length ? confirmed / due.length : null,
        resolvedAdherence:
          confirmed + omitted ? confirmed / (confirmed + omitted) : null,
      };
    };
    const days: Record<string, ReturnType<typeof summarize>> = {};
    for (let day = from; day < until; day = addDays(day, 1))
      days[day] = summarize(
        rows.filter((r) => localDate(r.scheduledAt, patient.timeZone) === day),
      );
    const page = q.page ?? 1,
      limit = q.limit ?? 100;
    return {
      patientId,
      timeZone: patient.timeZone,
      from,
      toExclusive: until,
      data: rows.slice((page - 1) * limit, page * limit),
      total: rows.length,
      page,
      limit,
      summary: summarize(rows),
      dailySummary: days,
    };
  }
  async medications(patientId: number, q: PatientMedicationsDto) {
    await this.access.assert(patientId);
    const page = q.page ?? 1,
      limit = q.limit ?? 20;
    const patient = await this.prisma.patient.findUniqueOrThrow({
      where: { id: patientId },
    });
    const today = new Date(
      localDate(new Date(), patient.timeZone) + 'T00:00:00Z',
    );
    const where: Prisma.PrescriptionItemWhereInput = {
      prescription: { patientId, status: q.status },
    };
    if (q.view === 'active')
      where.AND = [
        {
          isActive: true,
          prescription: { status: 'ACTIVO' },
          startDate: { lte: today },
          OR: [{ endDate: null }, { endDate: { gte: today } }],
        },
      ];
    if (q.view === 'completed')
      where.AND = [
        {
          OR: [
            { isActive: false },
            { prescription: { status: { in: ['FINALIZADO', 'CANCELADO'] } } },
            { endDate: { lt: today } },
          ],
        },
      ];
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.prescriptionItem.count({ where }),
      this.prisma.prescriptionItem.findMany({
        where,
        include: { medication: true, prescription: true, reminders: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    const now = new Date();
    return {
      data: rows.map((item) => {
        const today = localDate(now, item.timeZone);
        const next =
          occurrences(item, today, addDays(today, 7)).find((d) => d >= now) ??
          null;
        return { ...item, nextIntake: next };
      }),
      total,
      page,
      limit,
    };
  }
}
