// Error de dominio usado cuando el login no puede validar las credenciales.
export class InvalidCredentialsException extends Error {
  constructor() {
    super('Credenciales inválidas.');
    this.name = 'InvalidCredentialsException';
  }
}
