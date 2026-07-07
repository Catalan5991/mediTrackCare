// Entidad de dominio que representa el vinculo entre un usuario cuidador y un
// paciente. Mantiene solo datos propios de la relacion: parentesco o rol,
// indicador de cuidador principal, estado logico y fechas de auditoria.
export class Caregiver {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly patientId: number,
    public readonly relationship: string,
    public readonly isPrimary: boolean,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
