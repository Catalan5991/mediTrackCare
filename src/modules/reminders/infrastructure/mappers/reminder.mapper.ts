import { Reminder } from '../../../../../generated/prisma/client';
import { ReminderEntity } from '../../domain/entities/reminder.entity';

// Traduce modelos generados por Prisma a entidades del dominio.
export class ReminderMapper {
  /**
   * Ejecuta la operación from prisma.
   * @param reminder Valor de reminder requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static fromPrisma(reminder: Reminder): ReminderEntity {
    return new ReminderEntity({
      id: reminder.id,
      patientId: reminder.patientId,
      prescriptionItemId: reminder.prescriptionItemId,
      scheduledTime: reminder.scheduledTime,
      daysOfWeek: reminder.daysOfWeek,
      isActive: reminder.isActive,
      createdAt: reminder.createdAt,
      updatedAt: reminder.updatedAt,
    });
  }
}
