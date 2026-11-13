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
    retiredAt?: Date | null;
    doseUnit?: string | null;
    scheduledTimes?: string[];
    daysOfWeek?: number[];
    timeZone?: string;
    isActive?: boolean;
    medication?: unknown;
    quantity?: number | null;
    duration?: string | null;
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
  /**
   * Transforma el recurso solicitado.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
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
              retiredAt: item.retiredAt,
              doseUnit: item.doseUnit,
              scheduledTimes: item.scheduledTimes,
              daysOfWeek: item.daysOfWeek,
              timeZone: item.timeZone,
              isActive: item.isActive,
              medication: item.medication,
              quantity: item.quantity,
              duration: item.duration,
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
