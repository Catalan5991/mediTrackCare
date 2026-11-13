// Error de dominio para operaciones sobre pacientes inexistentes.
export class PatientNotFoundException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`El paciente con id ${id} no fue encontrado`);
    this.name = 'PatientNotFoundException';
  }
}
