import { Patient as PrismaPatient } from '../../../../../generated/prisma/client';
import { Patient } from '../../domain/entities/patient.entity';

// Convierte registros de Prisma en entidades para aislar el dominio.
export class PatientMapper {
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
