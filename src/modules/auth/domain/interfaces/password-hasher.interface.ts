// Token de inyeccion para intercambiar la estrategia de hashing sin tocar casos de uso.
export const PASSWORD_HASHER = 'PASSWORD_HASHER';

// Puerto criptografico para crear y verificar hashes de contrasenas.
export interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
