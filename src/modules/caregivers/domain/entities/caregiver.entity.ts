// Entidad de dominio que representa el vinculo entre un usuario cuidador y un
// paciente. Mantiene solo datos propios de la relacion: parentesco o rol,
// indicador de cuidador principal, estado logico y fechas de auditoria.
export class Caregiver {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   * @param userId Valor de user id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @param relationship Valor de relationship requerido por la operacion.
   * @param isPrimary Valor de is primary requerido por la operacion.
   * @param isActive Valor de is active requerido por la operacion.
   * @param createdAt Valor de created at requerido por la operacion.
   * @param updatedAt Valor de updated at requerido por la operacion.
   */
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
