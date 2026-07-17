export class Doctor {
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
  ) {}
}
