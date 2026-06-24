// Error de dominio para evitar correos duplicados al crear o actualizar usuarios.
export class UserAlreadyExistsException extends Error {
  constructor() {
    super('El correo electrónico ya se encuentra registrado.');
    this.name = 'UserAlreadyExistsException';
  }
}
