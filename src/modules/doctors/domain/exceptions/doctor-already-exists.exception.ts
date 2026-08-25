export class DoctorAlreadyExistsException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param message Valor de message requerido por la operacion.
   */
  constructor(message = 'El doctor ya existe') {
    super(message);
    this.name = 'DoctorAlreadyExistsException';
  }
}
