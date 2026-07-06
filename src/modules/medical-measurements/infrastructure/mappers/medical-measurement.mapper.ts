import { MedicalMeasurement } from '../../../../../generated/prisma/client';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';

// Traduce modelos generados por Prisma a entidades del dominio.
export class MedicalMeasurementMapper {
  static fromPrisma(
    measurement: MedicalMeasurement,
  ): MedicalMeasurementEntity {
    // Prisma.Decimal se convierte a number para mantener simple la respuesta API.
    return new MedicalMeasurementEntity({
      id: measurement.id,
      patientId: measurement.patientId,
      registeredByUserId: measurement.registeredByUserId,
      measurementType: measurement.measurementType,
      value: measurement.value.toNumber(),
      secondValue: measurement.secondValue
        ? measurement.secondValue.toNumber()
        : null,
      unit: measurement.unit,
      notes: measurement.notes,
      measuredAt: measurement.measuredAt,
      createdAt: measurement.createdAt,
      updatedAt: measurement.updatedAt,
    });
  }
}
