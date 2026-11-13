// Error de dominio lanzado cuando una operacion requiere una relacion de
// cuidado existente, pero el id recibido no corresponde a ningun registro.
export class CaregiverNotFoundException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param id Identificador único del recurso.
   */
  constructor(id: number) {
    super(`El cuidador con id ${id} no fue encontrado`);
    this.name = 'CaregiverNotFoundException';
  }
}
