export class InvalidDoctorUserException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param message Valor de message requerido por la operacion.
   */
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDoctorUserException';
  }
}
