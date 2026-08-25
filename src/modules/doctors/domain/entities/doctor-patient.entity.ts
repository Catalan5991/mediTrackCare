export class DoctorPatientAssignment {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @param isActive Valor de is active requerido por la operacion.
   * @param createdAt Valor de created at requerido por la operacion.
   * @param updatedAt Valor de updated at requerido por la operacion.
   */
  constructor(
    public readonly doctorId: number,
    public readonly patientId: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
