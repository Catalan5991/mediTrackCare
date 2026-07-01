import { Medication } from '../../../../../generated/prisma/client';
import { MedicationEntity } from '../../domain/entities/medication.entity';

// Convierte registros de Prisma en entidades para aislar el dominio.
export class MedicationMapper {
  static toDomain(medication: Medication): MedicationEntity {
    return new MedicationEntity({
      id: medication.id,
      name: medication.name,
      description: medication.description,
      presentation: medication.presentation,
      concentration: medication.concentration,
      unit: medication.unit,
      route: medication.route,
      isActive: medication.isActive,
      createdAt: medication.createdAt,
      updatedAt: medication.updatedAt,
    });
  }
}
