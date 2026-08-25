import { Role } from '../entities/role.entity';

// Token de inyeccion usado por Nest para resolver el puerto de persistencia.
// Los casos de uso dependen de este simbolo y no de Prisma directamente, para
// mantener separadas las reglas de aplicacion del adaptador de base de datos.
export const ROLES_REPOSITORY = Symbol('ROLES_REPOSITORY');

// Datos necesarios para registrar un rol. El nombre debe ser unico porque se
// usa como identificador funcional al asociar usuarios con permisos.
export interface CreateRoleData {
  name: string;
  description?: string;
}

// Campos modificables de un rol existente. Todos son opcionales porque PATCH
// recibe actualizaciones parciales y conserva los valores omitidos.
export interface UpdateRoleData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Filtros y paginacion aceptados por el listado de roles. El repositorio los
// traduce a condiciones concretas de Prisma.
export interface FindRolesParams {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

// Resultado paginado que consume la capa HTTP. lastPage se calcula junto al
// total para evitar que el controller conozca detalles de paginacion.
export interface PaginatedRoles {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

// Puerto de persistencia usado por los casos de uso del modulo Roles. Expone
// operaciones del dominio sin filtrar modelos ni tipos internos del ORM.
export interface RolesRepository {
  /**
   * Crea un rol con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateRoleData): Promise<Role>;
  /**
   * Obtiene el listado de rols que cumplen los filtros indicados.
   * @param params Valor de params requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(params: FindRolesParams): Promise<PaginatedRoles>;
  /**
   * Obtiene un rol por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<Role | null>;
  /**
   * Obtiene by name.
   * @param name Valor de name requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findByName(name: string): Promise<Role | null>;
  /**
   * Obtiene by name except id.
   * @param name Valor de name requerido por la operacion.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findByNameExceptId(name: string, id: number): Promise<Role | null>;
  /**
   * Actualiza un rol existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdateRoleData): Promise<Role>;
  /**
   * Ejecuta la operación soft delete.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  softDelete(id: number): Promise<Role>;
}
