// Token de inyeccion para desacoplar el hashing de la implementacion concreta.
export const USER_PASSWORD_HASHER = 'USER_PASSWORD_HASHER';

// Puerto que permite hashear contrasenas sin depender de bcrypt en casos de uso.
export interface UserPasswordHasher {
  /**
   * Genera el hash de el recurso solicitado.
   * @param password Contraseña en texto plano que debe procesarse de forma segura.
   * @returns Resultado producido por la operación.
   */
  hash(password: string): Promise<string>;
}
