import { Doctor } from '../entities/doctor.entity';
import { DoctorPatientAssignment } from '../entities/doctor-patient.entity';

export const DOCTORS_REPOSITORY = Symbol('DOCTORS_REPOSITORY');

export interface CreateDoctorData {
  userId: number;
  fullName: string;
  professionalLicense?: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

export interface UpdateDoctorData {
  userId?: number;
  fullName?: string;
  professionalLicense?: string | null;
  specialty?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
}

export interface FindDoctorsParams {
  search?: string;
  specialty?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedDoctors {
  data: Doctor[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface DoctorsRepository {
  /**
   * Crea un medico con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateDoctorData): Promise<Doctor>;
  /**
   * Obtiene el listado de medicos que cumplen los filtros indicados.
   * @param params Valor de params requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(params: FindDoctorsParams): Promise<PaginatedDoctors>;
  /**
   * Obtiene un medico por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<Doctor | null>;
  /**
   * Obtiene by user id.
   * @param userId Valor de user id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findByUserId(userId: number): Promise<Doctor | null>;
  /**
   * Obtiene by professional license.
   * @param license Valor de license requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findByProfessionalLicense(license: string): Promise<Doctor | null>;
  /**
   * Obtiene duplicate for update.
   * @param id Identificador único del recurso.
   * @param userId Valor de user id requerido por la operacion.
   * @param license Valor de license requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findDuplicateForUpdate(
    id: number,
    userId?: number,
    license?: string | null,
  ): Promise<Doctor | null>;
  /**
   * Actualiza un medico existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdateDoctorData): Promise<Doctor>;
  /**
   * Ejecuta la operación soft delete.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  softDelete(id: number): Promise<Doctor>;
  /**
   * Ejecuta la operación assign patient.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  assignPatient(
    doctorId: number,
    patientId: number,
  ): Promise<DoctorPatientAssignment>;
  /**
   * Elimina patient.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  removePatient(
    doctorId: number,
    patientId: number,
  ): Promise<DoctorPatientAssignment>;
  /**
   * Obtiene patient assignments.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findPatientAssignments(doctorId: number): Promise<DoctorPatientAssignment[]>;
}
