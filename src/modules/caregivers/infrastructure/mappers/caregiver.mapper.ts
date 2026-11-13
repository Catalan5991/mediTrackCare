import { Caregiver as PrismaCaregiver } from '../../../../../generated/prisma/client';
import { Caregiver } from '../../domain/entities/caregiver.entity';

// Convierte registros generados por Prisma en entidades de dominio. Este mapper
// evita que el resto del modulo dependa del tipo concreto emitido por el ORM.
export class CaregiverMapper {
  /**
   * Transforma el recurso solicitado.
   * @param caregiver Valor de caregiver requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static toDomain(caregiver: PrismaCaregiver): Caregiver {
    return new Caregiver(
      caregiver.id,
      caregiver.userId,
      caregiver.patientId,
      caregiver.relationship,
      caregiver.isPrimary,
      caregiver.isActive,
      caregiver.createdAt,
      caregiver.updatedAt,
    );
  }
}
