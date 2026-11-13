import { Patient as PrismaPatient } from '../../../../../generated/prisma/client';
import { Patient } from '../../domain/entities/patient.entity';

// Convierte registros de Prisma en entidades para aislar el dominio.
export class PatientMapper {
  /**
   * Transforma el recurso solicitado.
   * @param patient Valor de patient requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  static toDomain(patient: PrismaPatient): Patient {
    return new Patient(
      patient.id,
      patient.userId,
      patient.fullName,
      patient.birthDate,
      patient.gender,
      patient.phone,
      patient.address,
      patient.emergencyContactName,
      patient.emergencyContactPhone,
      patient.isActive,
      patient.createdAt,
      patient.updatedAt,
    );
  }
}
