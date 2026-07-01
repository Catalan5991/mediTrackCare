import { Gender } from '../../../../../generated/prisma/client';

// Valores admitidos para registrar el genero informado del paciente.
export const PATIENT_GENDERS = Gender;
export type PatientGender = Gender;

// Entidad de dominio que representa la ficha clinica basica del paciente.
export class Patient {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly fullName: string,
    public readonly birthDate: Date,
    public readonly gender: PatientGender,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly emergencyContactName: string | null,
    public readonly emergencyContactPhone: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
