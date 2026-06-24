// Token de inyeccion para desacoplar el hashing de la implementacion concreta.
export const USER_PASSWORD_HASHER = 'USER_PASSWORD_HASHER';

// Puerto que permite hashear contrasenas sin depender de bcrypt en casos de uso.
export interface UserPasswordHasher {
  hash(password: string): Promise<string>;
}
