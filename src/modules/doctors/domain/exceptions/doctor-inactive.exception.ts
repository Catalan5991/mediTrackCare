export class DoctorInactiveException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`El doctor con id ${id} ya está inactivo`);
    this.name = 'DoctorInactiveException';
  }
}
