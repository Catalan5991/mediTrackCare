// Error de dominio para bloquear nombres de rol duplicados. El filtro HTTP lo
// traduce a 409 Conflict para que el cliente entienda que hay choque de datos.
export class RoleAlreadyExistsException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param message Valor de message requerido por la operacion.
   */
  constructor(message = 'El rol ya existe') {
    super(message);
    this.name = 'RoleAlreadyExistsException';
  }
}
