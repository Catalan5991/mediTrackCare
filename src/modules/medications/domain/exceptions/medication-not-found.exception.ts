// Error de dominio para operaciones sobre medicamentos inexistentes.
export class MedicationNotFoundException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`El medicamento con ID ${id} no existe`);
    this.name = 'MedicationNotFoundException';
  }
}
