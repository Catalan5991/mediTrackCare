export class DoctorPatientAssignment {
  constructor(
    public readonly doctorId: number,
    public readonly patientId: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
