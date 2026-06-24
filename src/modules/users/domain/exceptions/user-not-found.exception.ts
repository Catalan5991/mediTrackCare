// Error de dominio para operaciones sobre usuarios inexistentes.
export class UserNotFoundException extends Error {
  constructor() {
    super('Usuario no encontrado.');
    this.name = 'UserNotFoundException';
  }
}
