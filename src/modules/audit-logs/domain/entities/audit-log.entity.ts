export class AuditLogEntity {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   * @param userId Valor de user id requerido por la operacion.
   * @param module Valor de module requerido por la operacion.
   * @param action Valor de action requerido por la operacion.
   * @param entityName Valor de entity name requerido por la operacion.
   * @param entityId Valor de entity id requerido por la operacion.
   * @param description Valor de description requerido por la operacion.
   * @param createdAt Valor de created at requerido por la operacion.
   */
  constructor(
    public readonly id: number,
    public readonly userId: number | null,
    public readonly module: string,
    public readonly action: string,
    public readonly entityName: string,
    public readonly entityId: number | null,
    public readonly description: string | null,
    public readonly createdAt: Date,
  ) {}
}
