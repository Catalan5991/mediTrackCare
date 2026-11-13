import { Patient, PatientGender } from '../entities/patient.entity';

// Token de inyeccion para desacoplar la aplicacion del repositorio concreto.
export const PATIENTS_REPOSITORY = Symbol('PATIENTS_REPOSITORY');

// Datos necesarios para crear una ficha de paciente.
export interface CreatePatientData {
  userId: number;
  fullName: string;
  birthDate: string;
  gender?: PatientGender;
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

// Campos modificables de una ficha de paciente existente.
export interface UpdatePatientData {
  userId?: number;
  fullName?: string;
  birthDate?: string;
  gender?: PatientGender;
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isActive?: boolean;
}

// Filtros y paginacion aceptados por el listado de pacientes.
export interface FindPatientsParams {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

// Resultado paginado que consume la capa HTTP.
export interface PaginatedPatients {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

// Puerto de persistencia usado por los casos de uso del modulo Patients.
export interface PatientsRepository {
  /**
   * Crea un paciente con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreatePatientData): Promise<Patient>;
  /**
   * Obtiene el listado de pacientes que cumplen los filtros indicados.
   * @param params Valor de params requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(params: FindPatientsParams): Promise<PaginatedPatients>;
  /**
   * Obtiene un paciente por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<Patient | null>;
  /**
   * Obtiene by user id.
   * @param userId Valor de user id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findByUserId(userId: number): Promise<Patient | null>;
  /**
   * Actualiza un paciente existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdatePatientData): Promise<Patient>;
  /**
   * Ejecuta la operación soft delete.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  softDelete(id: number): Promise<Patient>;
}
