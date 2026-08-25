import { Gender } from '../../../../../generated/prisma/client';

// Valores admitidos para registrar el genero informado del paciente.
export const PATIENT_GENDERS = Gender;
export type PatientGender = Gender;

// Entidad de dominio que representa la ficha clinica basica del paciente.
export class Patient {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   * @param userId Valor de user id requerido por la operacion.
   * @param fullName Valor de full name requerido por la operacion.
   * @param birthDate Valor de birth date requerido por la operacion.
   * @param gender Valor de gender requerido por la operacion.
   * @param phone Valor de phone requerido por la operacion.
   * @param address Valor de address requerido por la operacion.
   * @param emergencyContactName Valor de emergency contact name requerido por la operacion.
   * @param emergencyContactPhone Valor de emergency contact phone requerido por la operacion.
   * @param isActive Valor de is active requerido por la operacion.
   * @param createdAt Valor de created at requerido por la operacion.
   * @param updatedAt Valor de updated at requerido por la operacion.
   */
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
