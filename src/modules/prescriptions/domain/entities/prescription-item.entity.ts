// Propiedades que describen un medicamento indicado dentro de una receta.
export interface PrescriptionItemProps {
  id?: number;
  prescriptionId?: number;
  medicationId: number;
  dose: string;
  frequency: string;
  duration?: string | null;
  instructions?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  quantity?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Entidad de dominio para cada medicamento y sus instrucciones de uso.
export class PrescriptionItemEntity {
  public readonly id?: number;
  public readonly prescriptionId?: number;
  public readonly medicationId: number;
  public dose: string;
  public frequency: string;
  public duration?: string | null;
  public instructions?: string | null;
  public startDate?: Date | null;
  public endDate?: Date | null;
  public quantity?: number | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param props Valor de props requerido por la operacion.
   */
  constructor(props: PrescriptionItemProps) {
    this.id = props.id;
    this.prescriptionId = props.prescriptionId;
    this.medicationId = props.medicationId;
    this.dose = props.dose;
    this.frequency = props.frequency;
    this.duration = props.duration;
    this.instructions = props.instructions;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
