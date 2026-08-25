// Error de dominio para evitar registrar dos cuentas con el mismo correo.
export class UserAlreadyExistsException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   */
  constructor() {
    super('El correo electrónico ya se encuentra registrado.');
    this.name = 'UserAlreadyExistsException';
  }
}
