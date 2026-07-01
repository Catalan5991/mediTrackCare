import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { PrescriptionItemEntity } from '../../domain/entities/prescription-item.entity';

// Forma esperada de una receta leida desde Prisma con sus items incluidos.
type PrismaPrescriptionWithItems = {
  id: number;
  patientId: number;
  doctorId: number | null;
  diagnosis: string | null;
  notes: string | null;
  startDate: Date;
  endDate: Date | null;
  status: any;
  createdAt: Date;
  updatedAt: Date;
  items?: {
    id: number;
    prescriptionId: number;
    medicationId: number;
    dose: string;
    frequency: string;
    instructions: string | null;
    startDate: Date;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

// Traduce modelos de Prisma a entidades de dominio para aislar la capa de aplicacion.
export class PrismaPrescriptionMapper {
  static toDomain(data: PrismaPrescriptionWithItems): PrescriptionEntity {
    return new PrescriptionEntity({
      id: data.id,
      patientId: data.patientId,
      doctorId: data.doctorId,
      diagnosis: data.diagnosis,
      generalInstructions: data.notes,
      issueDate: data.startDate,
      expirationDate: data.endDate,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      items:
        data.items?.map(
          (item) =>
            new PrescriptionItemEntity({
              id: item.id,
              prescriptionId: item.prescriptionId,
              medicationId: item.medicationId,
              dose: item.dose,
              frequency: item.frequency,
              instructions: item.instructions,
              startDate: item.startDate,
              endDate: item.endDate,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            }),
        ) ?? [],
    });
  }
}
