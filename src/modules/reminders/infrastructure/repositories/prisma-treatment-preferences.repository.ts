import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import type { TreatmentPreferencesRepository } from '../../domain/interfaces/treatment-preferences.repository';
import { TreatmentPreferencesDto } from '../../application/dtos/treatment-preferences.dto';
import { ReminderMapper } from '../mappers/reminder.mapper';
@Injectable()
export class PrismaTreatmentPreferencesRepository implements TreatmentPreferencesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  async configure(itemId: number, dto: TreatmentPreferencesDto) {
    return this.prisma.$transaction(
      async (tx) => {
        const item = await tx.prescriptionItem.findUnique({
          where: { id: itemId },
          include: { prescription: true },
        });
        if (!item) throw new NotFoundException();
        await this.access.assert(item.prescription.patientId, 'reminders', tx);
        if (
          !item.isActive ||
          item.prescription.status !== 'ACTIVO' ||
          !item.scheduledTimes.length
        )
          throw new BadRequestException(
            'Se requiere un tratamiento activo con horarios prescritos.',
          );
        if (
          dto.confirmTreatment &&
          this.access.actor().role.toUpperCase() === 'DOCTOR'
        )
          throw new ForbiddenException(
            'La confirmacion corresponde al paciente o cuidador autorizado.',
          );
        let preferencesChanged = false;
        for (const scheduledTime of item.scheduledTimes) {
          const data = {
            isActive: dto.isActive,
            advanceMinutes: dto.advanceMinutes,
            repeatMinutes: dto.repeatMinutes,
            repeatCount: dto.repeatCount,
            notifyCaregiver: dto.notifyCaregiver,
          };
          const existing = await tx.reminder.findFirst({
            where: { prescriptionItemId: itemId, scheduledTime },
            orderBy: { id: 'asc' },
          });
          if (existing) {
            const changed = Object.entries(data).some(
              ([key, value]) =>
                value !== undefined &&
                value !== existing[key as keyof typeof existing],
            );
            if (changed) {
              await tx.reminder.update({ where: { id: existing.id }, data });
              preferencesChanged = true;
            }
          } else {
            await tx.reminder.create({
              data: {
                ...data,
                patientId: item.prescription.patientId,
                prescriptionItemId: itemId,
                scheduledTime,
              },
            });
            preferencesChanged = true;
          }
        }
        let confirmedAt = item.patientConfirmedAt;
        if (dto.confirmTreatment && !confirmedAt) {
          confirmedAt = new Date();
          await tx.prescriptionItem.update({
            where: { id: itemId },
            data: {
              patientConfirmedAt: confirmedAt,
              patientConfirmedByUserId: this.access.actor().id,
            },
          });
        }
        if (preferencesChanged)
          await tx.notification.updateMany({
            where: {
              intake: { prescriptionItemId: itemId },
              status: 'PENDIENTE',
            },
            data: { cancelledAt: new Date() },
          });
        if (preferencesChanged || confirmedAt !== item.patientConfirmedAt)
          await tx.auditLog.create({
            data: {
              userId: this.access.actor().id,
              module: 'reminders',
              action: 'TREATMENT_PREFERENCES',
              entityName: 'PrescriptionItem',
              entityId: itemId,
              description: JSON.stringify(dto),
            },
          });
        return {
          prescriptionItemId: itemId,
          patientConfirmedAt: confirmedAt,
          reminders: (
            await tx.reminder.findMany({
              where: { prescriptionItemId: itemId },
              orderBy: { scheduledTime: 'asc' },
            })
          ).map(ReminderMapper.fromPrisma),
        };
      },
      { isolationLevel: 'Serializable' },
    );
  }
}
