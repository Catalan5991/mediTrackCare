// Error de dominio para evitar correos duplicados al crear o actualizar usuarios.
export class UserAlreadyExistsException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   */
  constructor() {
    super('El correo electrónico ya se encuentra registrado.');
    this.name = 'UserAlreadyExistsException';
  }
}
