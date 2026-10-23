// Propiedades que describen un medicamento indicado dentro de una receta.
export interface PrescriptionItemProps {
  id?: number;
  prescriptionId?: number;
  medicationId: number;
  dose: string;
  retiredAt?: Date | null;
  doseUnit?: string | null;
  scheduledTimes?: string[];
  daysOfWeek?: number[];
  timeZone?: string;
  isActive?: boolean;
  medication?: unknown;
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
  public retiredAt?: Date | null;
  public doseUnit?: string | null;
  public scheduledTimes?: string[];
  public daysOfWeek?: number[];
  public timeZone?: string;
  public isActive?: boolean;
  public medication?: unknown;
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
    this.retiredAt = props.retiredAt;
    this.doseUnit = props.doseUnit;
    this.scheduledTimes = props.scheduledTimes;
    this.daysOfWeek = props.daysOfWeek;
    this.timeZone = props.timeZone;
    this.isActive = props.isActive;
    this.medication = props.medication;
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
