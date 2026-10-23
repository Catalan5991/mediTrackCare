import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  occurrences,
  localDate,
  addDays,
  occurrenceKey,
} from '../../../prescriptions/domain/schedule';
import type { NotificationSchedulerRepository } from '../../domain/interfaces/notification-scheduler.repository';
@Injectable()
export class PrismaNotificationSchedulerRepository implements NotificationSchedulerRepository {
  constructor(private readonly prisma: PrismaService) {}
  async schedule() {
    let cursor = 0;
    for (;;) {
      const patients = await this.prisma.patient.findMany({
        where: { id: { gt: cursor }, isActive: true, user: { isActive: true } },
        orderBy: { id: 'asc' },
        take: 50,
        select: { id: true },
      });
      if (!patients.length) return;
      for (const patient of patients)
        await this.prisma.$transaction(
          async (tx) => {
            // Un solo productor por paciente, incluso con varios procesos worker.
            const lock = await tx.$queryRaw<
              Array<{ locked: boolean }>
            >`SELECT pg_try_advisory_xact_lock(360, ${patient.id}) AS locked`;
            if (!lock[0]?.locked) return;
            const profile = await tx.patient.findUniqueOrThrow({
              where: { id: patient.id },
              include: {
                caregivers: {
                  where: {
                    isActive: true,
                    status: 'ACTIVE',
                    canRead: true,
                    canTrack: true,
                    user: { isActive: true, role: { isActive: true } },
                  },
                },
              },
            });
            const items = await tx.prescriptionItem.findMany({
              where: {
                isActive: true,
                prescription: {
                  patientId: patient.id,
                  status: 'ACTIVO',
                  doctor: { isActive: true, verificationStatus: 'VERIFIED' },
                },
              },
              include: {
                prescription: true,
                medication: true,
                reminders: { orderBy: { id: 'asc' } },
              },
            });
            const now = new Date();
            for (const item of items) {
              const from = localDate(now, item.timeZone);
              const reminders = new Map<
                string,
                (typeof item.reminders)[number]
              >();
              for (const reminder of item.reminders)
                if (!reminders.has(reminder.scheduledTime))
                  reminders.set(reminder.scheduledTime, reminder);
              for (const scheduledAt of occurrences(
                item,
                addDays(from, -1),
                addDays(from, 2),
              )) {
                const key = occurrenceKey(item.id, scheduledAt);
                let intake = await tx.intake.findFirst({
                  where: { prescriptionItemId: item.id, scheduledAt },
                  orderBy: { id: 'asc' },
                });
                const localTime = new Intl.DateTimeFormat('en-GB', {
                  timeZone: item.timeZone,
                  hour: '2-digit',
                  minute: '2-digit',
                  hourCycle: 'h23',
                }).format(scheduledAt);
                const reminder = reminders.get(localTime);
                if (!intake)
                  intake = await tx.intake.upsert({
                    where: { occurrenceKey: key },
                    update: {},
                    create: {
                      occurrenceKey: key,
                      patientId: patient.id,
                      prescriptionItemId: item.id,
                      reminderId: reminder?.id,
                      scheduledAt,
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
                if (
                  !['PENDIENTE', 'RETRASADA'].includes(intake.status) ||
                  !reminder?.isActive
                )
                  continue;
                const recipients = [
                  profile.userId,
                  ...(reminder.notifyCaregiver
                    ? profile.caregivers.map((c) => c.userId)
                    : []),
                ];
                for (
                  let repetition = 0;
                  repetition <= reminder.repeatCount;
                  repetition++
                ) {
                  const scheduledFor = new Date(
                    scheduledAt.getTime() -
                      reminder.advanceMinutes * 60000 +
                      repetition * (reminder.repeatMinutes ?? 0) * 60000,
                  );
                  if (scheduledFor.getTime() < now.getTime() - 60000) continue;
                  for (const userId of new Set(recipients)) {
                    const deduplicationKey =
                      key +
                      ':' +
                      userId +
                      ':' +
                      reminder.id +
                      ':' +
                      reminder.updatedAt.getTime() +
                      ':' +
                      repetition;
                    await tx.notification.upsert({
                      where: { deduplicationKey },
                      update: {},
                      create: {
                        deduplicationKey,
                        userId,
                        patientId: patient.id,
                        intakeId: intake.id,
                        title: 'Recordatorio de medicamento',
                        message: item.medication.name + ' - ' + item.dose,
                        type: 'RECORDATORIO_TOMA',
                        scheduledFor,
                        status: 'PENDIENTE',
                      },
                    });
                  }
                }
              }
            }
          },
          { timeout: 60000 },
        );
      cursor = patients[patients.length - 1].id;
    }
  }
}
