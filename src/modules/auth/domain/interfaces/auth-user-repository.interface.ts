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
  create(data: CreateAuthUserData): Promise<AuthUser>;
  findById(id: number): Promise<AuthUser | null>;
  findByEmail(email: string): Promise<AuthUser | null>;
}
