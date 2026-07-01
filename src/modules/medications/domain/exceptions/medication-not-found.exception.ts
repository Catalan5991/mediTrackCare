// Error de dominio para operaciones sobre medicamentos inexistentes.
export class MedicationNotFoundException extends Error {
  constructor(id: number) {
    super(`El medicamento con ID ${id} no existe`);
    this.name = 'MedicationNotFoundException';
  }
}
