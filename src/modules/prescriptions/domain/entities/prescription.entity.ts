import { PrescriptionStatus } from '../../../../../generated/prisma/client';
import { PrescriptionItemEntity } from './prescription-item.entity';

// Propiedades que representan el estado completo de una receta en el dominio.
export interface PrescriptionProps {
  id?: number;
  patientId: number;
  doctorId?: number | null;
  diagnosis?: string | null;
  generalInstructions?: string | null;
  issueDate?: Date;
  expirationDate?: Date | null;
  status?: PrescriptionStatus;
  items?: PrescriptionItemEntity[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Entidad de dominio que concentra la informacion y transiciones de estado de una receta.
export class PrescriptionEntity {
  public readonly id?: number;
  public readonly patientId: number;
  public readonly doctorId?: number | null;
  public diagnosis?: string | null;
  public generalInstructions?: string | null;
  public issueDate?: Date;
  public expirationDate?: Date | null;
  public status: PrescriptionStatus;
  public items: PrescriptionItemEntity[];
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: PrescriptionProps) {
    this.id = props.id;
    this.patientId = props.patientId;
    this.doctorId = props.doctorId;
    this.diagnosis = props.diagnosis;
    this.generalInstructions = props.generalInstructions;
    this.issueDate = props.issueDate;
    this.expirationDate = props.expirationDate;
    this.status = props.status ?? PrescriptionStatus.ACTIVO;
    this.items = props.items ?? [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // Marca la receta como cancelada.
  cancel(): void {
    this.status = PrescriptionStatus.CANCELADO;
  }

  // Marca la receta como finalizada.
  complete(): void {
    this.status = PrescriptionStatus.FINALIZADO;
  }

  // Marca la receta como pausada por vencimiento o interrupcion del tratamiento.
  expire(): void {
    this.status = PrescriptionStatus.PAUSADO;
  }
}
