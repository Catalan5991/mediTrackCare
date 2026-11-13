import { User } from '../entities/user';

// Token de inyeccion para sustituir el repositorio sin cambiar la aplicacion.
export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role?: string;
  isActive?: boolean;
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
};

// Puerto de persistencia consumido por los casos de uso del modulo Users.
export interface UsersRepository {
  /**
   * Crea un usuario con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateUserData): Promise<User>;
  /**
   * Obtiene el listado de usuarios que cumplen los filtros indicados.
   * @returns Resultado producido por la operación.
   */
  findAll(): Promise<User[]>;
  /**
   * Obtiene un usuario por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<User | null>;
  /**
   * Obtiene by email.
   * @param email Valor de email requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findByEmail(email: string): Promise<User | null>;
  /**
   * Obtiene by email except id.
   * @param email Valor de email requerido por la operacion.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findByEmailExceptId(email: string, id: number): Promise<User | null>;
  /**
   * Actualiza un usuario existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, data: UpdateUserData): Promise<User>;
  /**
   * Ejecuta la operación soft delete.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  softDelete(id: number): Promise<User>;
}
