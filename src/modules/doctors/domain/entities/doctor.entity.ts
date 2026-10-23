export class Doctor {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   * @param userId Valor de user id requerido por la operacion.
   * @param fullName Valor de full name requerido por la operacion.
   * @param professionalLicense Valor de professional license requerido por la operacion.
   * @param specialty Valor de specialty requerido por la operacion.
   * @param phone Valor de phone requerido por la operacion.
   * @param email Valor de email requerido por la operacion.
   * @param isActive Valor de is active requerido por la operacion.
   * @param createdAt Valor de created at requerido por la operacion.
   * @param updatedAt Valor de updated at requerido por la operacion.
   */
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly fullName: string,
    public readonly professionalLicense: string | null,
    public readonly specialty: string | null,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly verificationStatus: string = 'PENDING',
    public readonly verifiedAt: Date | null = null,
  ) {}
}
