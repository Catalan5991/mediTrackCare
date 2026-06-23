// Error de dominio para evitar registrar dos cuentas con el mismo correo.
export class UserAlreadyExistsException extends Error {
  constructor() {
    super('El correo electrónico ya se encuentra registrado.');
    this.name = 'UserAlreadyExistsException';
  }
}
