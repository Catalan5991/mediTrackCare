export class FileEntity {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   * @param patientId Valor de patient id requerido por la operacion.
   * @param prescriptionId Valor de prescription id requerido por la operacion.
   * @param medicationId Valor de medication id requerido por la operacion.
   * @param fileName Valor de file name requerido por la operacion.
   * @param fileUrl Valor de file url requerido por la operacion.
   * @param fileType Valor de file type requerido por la operacion.
   * @param description Valor de description requerido por la operacion.
   * @param createdAt Valor de created at requerido por la operacion.
   */
  constructor(
    public readonly id: number,
    public readonly patientId: number | null,
    public readonly prescriptionId: number | null,
    public readonly medicationId: number | null,
    public readonly fileName: string,
    public readonly fileUrl: string,
    public readonly fileType: string,
    public readonly description: string | null,
    public readonly createdAt: Date,
  ) {}
}
