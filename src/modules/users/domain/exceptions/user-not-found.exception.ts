// Error de dominio para operaciones sobre usuarios inexistentes.
export class UserNotFoundException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   */
  constructor() {
    super('Usuario no encontrado.');
    this.name = 'UserNotFoundException';
  }
}
