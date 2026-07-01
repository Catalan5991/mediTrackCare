// Error de dominio para operaciones sobre pacientes inexistentes.
export class PatientNotFoundException extends Error {
  constructor(id: number) {
    super(`El paciente con id ${id} no fue encontrado`);
    this.name = 'PatientNotFoundException';
  }
}
