// Token de inyeccion para intercambiar la estrategia de hashing sin tocar casos de uso.
export const PASSWORD_HASHER = 'PASSWORD_HASHER';

// Puerto criptografico para crear y verificar hashes de contrasenas.
export interface PasswordHasher {
  /**
   * Genera el hash de el recurso solicitado.
   * @param password Contraseña en texto plano que debe procesarse de forma segura.
   * @returns Resultado producido por la operación.
   */
  hash(password: string): Promise<string>;
  /**
   * Compara el recurso solicitado.
   * @param password Contraseña en texto plano que debe procesarse de forma segura.
   * @param hashedPassword Valor de hashed password requerido por la operacion.
   * @returns Indica si la validación o condición se cumple.
   */
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
