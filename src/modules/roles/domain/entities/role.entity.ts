// Entidad de dominio que representa un rol del sistema. Un rol agrupa permisos
// o responsabilidades funcionales para usuarios, por ejemplo administrador,
// paciente, medico o cuidador. La entidad mantiene solo datos propios del rol y
// no expone detalles del modelo Prisma.
export class Role {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   * @param name Valor de name requerido por la operacion.
   * @param description Valor de description requerido por la operacion.
   * @param isActive Valor de is active requerido por la operacion.
   * @param createdAt Valor de created at requerido por la operacion.
   * @param updatedAt Valor de updated at requerido por la operacion.
   */
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
