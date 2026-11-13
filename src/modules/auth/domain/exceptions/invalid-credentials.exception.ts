// Error de dominio usado cuando el login no puede validar las credenciales.
export class InvalidCredentialsException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   */
  constructor() {
    super('Credenciales inválidas.');
    this.name = 'InvalidCredentialsException';
  }
}
