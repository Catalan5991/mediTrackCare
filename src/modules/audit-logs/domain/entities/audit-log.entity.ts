export class AuditLogEntity {
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
