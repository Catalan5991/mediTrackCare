// Error de dominio para evitar fichas duplicadas de paciente.
export class PatientAlreadyExistsException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param message Valor de message requerido por la operacion.
   */
  constructor(message = 'El paciente ya existe') {
    super(message);
    this.name = 'PatientAlreadyExistsException';
  }
}
