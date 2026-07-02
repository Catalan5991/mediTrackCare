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
  create(data: CreatePatientData): Promise<Patient>;
  findAll(params: FindPatientsParams): Promise<PaginatedPatients>;
  findById(id: number): Promise<Patient | null>;
  findByUserId(userId: number): Promise<Patient | null>;
  update(id: number, data: UpdatePatientData): Promise<Patient>;
  softDelete(id: number): Promise<Patient>;
}
