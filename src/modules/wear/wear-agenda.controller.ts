import { Controller, Get, Headers, Injectable, Module, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { addDays, localDate, localInstant, occurrences, occurrenceKey } from '../prescriptions/domain/schedule';

/**
 * Read-only unified agenda for a paired device.
 * Never trusts a caller-provided patient ID and never changes intake status.
 */
@Injectable()
class WearAgendaService {
  constructor(private readonly db: PrismaService) {}

  async agenda(token?: string) {
    if (!token || !/^[a-f0-9]{64}$/.test(token))
      throw new UnauthorizedException('Credencial de reloj inválida');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const device = await this.db.wearDevice.findUnique({
      where: { tokenHash },
      include: { user: { include: { patientProfile: true } } },
    });
    const patient = device?.user.patientProfile;
    if (!device || device.revokedAt || !device.user.isActive || !patient?.isActive)
      throw new UnauthorizedException('Reloj no autorizado');

    const date = localDate(new Date(), patient.timeZone);
    const nextDate = addDays(date, 1);
    const untilDate = addDays(date, 2);
    const now = new Date();
    const rangeFrom = localInstant(date, "00:00", patient.timeZone);
    const rangeUntil = localInstant(untilDate, "00:00", patient.timeZone);
    if (!rangeFrom || !rangeUntil) throw new UnauthorizedException("Zona horaria inválida");
    const [personal, clinical, clinicalIntakes] = await Promise.all([
      this.db.patientTreatment.findMany({
        where: { patientId: patient.id }, include: { medication: true,
          intakes: { where: { scheduledAt: { gte: rangeFrom, lt: rangeUntil } } } },
        orderBy: { id: 'asc' },
      }),
      this.db.prescriptionItem.findMany({
        where: { prescription: { patientId: patient.id } },
        include: { prescription: true, medication: true },
        orderBy: { id: 'asc' },
      }),
      this.db.intake.findMany({
        where: { patientId: patient.id, scheduledAt: { gte: rangeFrom, lt: rangeUntil } },
        select: { prescriptionItemId: true, scheduledAt: true, takenAt: true, status: true },
        orderBy: { id: 'desc' },
      }),
    ]);

    const allPersonal = personal.flatMap(t => {
      const schedule = (day: string) => {
        const start = t.startDate?.toISOString().slice(0, 10);
        const end = t.endDate?.toISOString().slice(0, 10);
        if (!start || day < start || (end && day > end)) return [] as Date[];
        const dayOfWeek = new Date(day + 'T00:00:00Z').getUTCDay();
        if (t.daysOfWeek.length && !t.daysOfWeek.includes(dayOfWeek)) return [] as Date[];
        return [...new Set(t.scheduledTimes)].map(time => localInstant(day, time, t.timeZone))
          .filter((at): at is Date => at !== null).sort((a, b) => a.getTime() - b.getTime());
      };
      const times = [...schedule(date), ...schedule(nextDate)];
      return times.map((at, index) => {
        const saved = t.intakes.find(x => x.scheduledAt?.getTime() === at.getTime());
        const next = times[index + 1];
        const status = saved?.status === 'TAKEN' ? 'TAKEN'
          : saved?.status === 'SKIPPED' ? 'SKIPPED'
          : t.status !== 'ACTIVE' ? 'CANCELLED'
          : next && next <= now ? 'EXPIRED_UNCONFIRMED'
          : at <= now ? 'LATE' : 'PENDING';
        return {
          patientId: patient.id, source: 'PERSONAL', occurrenceKey: 'personal:' + t.id + ':' + at.toISOString(),
          medicationId: t.medicationId, medicationName: t.medication.name,
          dose: [t.dose, t.doseUnit].filter(Boolean).join(' '),
          scheduledAt: at.toISOString(), status, takenAt: saved?.takenAt?.toISOString() ?? null,
        };
      });
    });

    const allClinical = clinical.flatMap(item => {
      const times = occurrences(item, addDays(date, -1), untilDate)
        .filter(at => {
          const day = localDate(at, patient.timeZone);
          return day === date || day === nextDate;
        });
      return times.map(at => {
        const saved = clinicalIntakes.find(x =>
          x.prescriptionItemId === item.id && x.scheduledAt.getTime() === at.getTime());
        const raw = saved?.status ?? (at <= now ? 'RETRASADA' : 'PENDIENTE');
        const status = ({
          TOMADA: 'TAKEN', OMITIDA: 'SKIPPED', CANCELADA: 'CANCELLED',
          RETRASADA: 'LATE', PENDIENTE: 'PENDING',
        } as Record<string, string>)[raw] ?? 'UNKNOWN';
        return {
          patientId: patient.id, source: 'CLINICAL', occurrenceKey: occurrenceKey(item.id, at),
          medicationId: item.medicationId, medicationName: item.medication.name,
          dose: item.dose, scheduledAt: at.toISOString(),
          status, takenAt: saved?.takenAt?.toISOString() ?? null,
        };
      });
    });

    const unique = new Map<string, (typeof allPersonal)[number]>();
    for (const entry of [...allClinical, ...allPersonal]) {
      const key = entry.patientId + ':' + entry.source + ':' + entry.occurrenceKey;
      if (!unique.has(key)) unique.set(key, entry);
    }
    return {
      patientId: patient.id, timeZone: patient.timeZone, date, generatedAt: now.toISOString(),
      data: [...unique.values()].sort((a, b) =>
        a.scheduledAt.localeCompare(b.scheduledAt) || a.occurrenceKey.localeCompare(b.occurrenceKey)),
    };
  }
}

@Controller('wear/agenda')
export class WearAgendaController {
  constructor(private readonly service: WearAgendaService) {}
  @Public() @Get()
  agenda(@Headers('x-wear-token') token?: string) { return this.service.agenda(token); }
}
@Module({ controllers: [WearAgendaController], providers: [WearAgendaService, PrismaService] })
export class WearAgendaModule {}
