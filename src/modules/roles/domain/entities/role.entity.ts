// Entidad de dominio que representa un rol del sistema. Un rol agrupa permisos
// o responsabilidades funcionales para usuarios, por ejemplo administrador,
// paciente, medico o cuidador. La entidad mantiene solo datos propios del rol y
// no expone detalles del modelo Prisma.
export class Role {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
