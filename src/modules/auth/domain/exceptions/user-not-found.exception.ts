// Error de dominio para accesos a perfiles inexistentes o no disponibles.
export class UserNotFoundException extends Error {
  constructor() {
    super('Usuario no encontrado.');
    this.name = 'UserNotFoundException';
  }
}
