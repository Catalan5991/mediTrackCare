export class FileEntity {
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
