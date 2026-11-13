import { Caregiver } from '../entities/caregiver.entity';

// Token de inyeccion usado por Nest para resolver el puerto de persistencia.
// Los casos de uso dependen de este simbolo y no de Prisma directamente, lo que
// permite cambiar la implementacion sin tocar reglas de aplicacion.
export const CAREGIVERS_REPOSITORY = Symbol('CAREGIVERS_REPOSITORY');

// Datos minimos para crear el vinculo cuidador-paciente. La combinacion
// userId + patientId debe ser unica en base de datos para impedir duplicados.
export interface CreateCaregiverData {
  userId: number;
  patientId: number;
  relationship: string;
  isPrimary?: boolean;
}

// Campos modificables de una relacion existente. Se definen como opcionales
// porque los endpoints PATCH reciben actualizaciones parciales.
export interface UpdateCaregiverData {
  userId?: number;
  patientId?: number;
  relationship?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

// Filtros y paginacion aceptados por el listado de cuidadores. La capa de
// infraestructura traduce estos parametros a un where de Prisma.
export interface FindCaregiversParams {
  search?: string;
  page?: number;
  limit?: number;
  userId?: number;
  patientId?: number;
  isPrimary?: boolean;
  isActive?: boolean;
}

// Resultado paginado que consume la capa HTTP. lastPage se calcula en el
// repositorio para que el controller no conozca detalles de consulta.
export interface PaginatedCaregivers {
  data: Caregiver[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

// Puerto de persistencia usado por los casos de uso del modulo Caregivers.
// Define las operaciones que necesita la aplicacion sin exponer modelos Prisma.
export interface CaregiversRepository {
  /**
   * Crea un cuidador con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateCaregiverData): Promise<Caregiver>;
  /**
   * Obtiene el listado de cuidadors que cumplen los filtros indicados.
   * @param params Valor de params requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(params: FindCaregiversParams): Promise<PaginatedCaregivers>;
  /**
   * Obtiene un cuidador por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<Caregiver | null>;
  /**
   * Obtiene by user and patient.
   * @param userId Valor de user id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findByUserAndPatient(
    userId: number,
    patientId: number,
  ): Promise<Caregiver | null>;
  /**
   * Actualiza un cuidador existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdateCaregiverData): Promise<Caregiver>;
  /**
   * Ejecuta la operación soft delete.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  softDelete(id: number): Promise<Caregiver>;
}
