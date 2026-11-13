export class DoctorNotFoundException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`El doctor con id ${id} no fue encontrado`);
    this.name = 'DoctorNotFoundException';
  }
}
