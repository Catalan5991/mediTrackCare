import { Intake } from '../../../../../generated/prisma/client';
import { IntakeEntity } from '../../domain/entities/intake.entity';

// Traduce modelos generados por Prisma a entidades del dominio.
export class IntakeMapper {
  static fromPrisma(intake: Intake): IntakeEntity {
    return new IntakeEntity({
      id: intake.id,
      patientId: intake.patientId,
      prescriptionItemId: intake.prescriptionItemId,
      reminderId: intake.reminderId,
      confirmedByUserId: intake.confirmedByUserId,
      scheduledAt: intake.scheduledAt,
      takenAt: intake.takenAt,
      status: intake.status,
      notes: intake.notes,
      createdAt: intake.createdAt,
      updatedAt: intake.updatedAt,
    });
  }
}
