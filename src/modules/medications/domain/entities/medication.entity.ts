import {
  MedicationForm,
  MedicationRoute,
} from '../../../../../generated/prisma/client';

// Propiedades que componen un medicamento dentro del dominio.
export interface MedicationProps {
  id?: number;
  name: string;
  description?: string | null;
  presentation: MedicationForm;
  concentration?: string | null;
  unit?: string | null;
  route: MedicationRoute;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Entidad de dominio que centraliza los datos del catalogo de medicamentos.
export class MedicationEntity {
  public readonly id?: number;
  public name: string;
  public description?: string | null;
  public presentation: MedicationForm;
  public concentration?: string | null;
  public unit?: string | null;
  public route: MedicationRoute;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param props Valor de props requerido por la operacion.
   */
  constructor(props: MedicationProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.presentation = props.presentation;
    this.concentration = props.concentration;
    this.unit = props.unit;
    this.route = props.route;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
