// Error de dominio para accesos a perfiles inexistentes o no disponibles.
export class UserNotFoundException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   */
  constructor() {
    super('Usuario no encontrado.');
    this.name = 'UserNotFoundException';
  }
}
