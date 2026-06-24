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
  create(data: CreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailExceptId(email: string, id: number): Promise<User | null>;
  update(id: number, data: UpdateUserData): Promise<User>;
  softDelete(id: number): Promise<User>;
}
