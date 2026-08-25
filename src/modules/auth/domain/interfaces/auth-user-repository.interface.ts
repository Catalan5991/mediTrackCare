import { AuthUser } from '../entities/auth-user';

// Token de inyeccion para desacoplar casos de uso de la implementacion de persistencia.
export const AUTH_USER_REPOSITORY = 'AUTH_USER_REPOSITORY';

export type CreateAuthUserData = {
  name: string;
  email: string;
  password: string;
};

// Puerto de persistencia que la capa de aplicacion consume sin conocer Prisma.
export interface AuthUserRepository {
  /**
   * Crea un usuario autenticado con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  create(data: CreateAuthUserData): Promise<AuthUser>;
  /**
   * Obtiene un usuario autenticado por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<AuthUser | null>;
  /**
   * Obtiene by email.
   * @param email Valor de email requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findByEmail(email: string): Promise<AuthUser | null>;
}
