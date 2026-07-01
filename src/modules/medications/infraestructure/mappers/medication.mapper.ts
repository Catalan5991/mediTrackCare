import { Medication } from '../../../../../generated/prisma/client';
import { MedicationEntity } from '../../domain/entities/medication.entity';
 
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