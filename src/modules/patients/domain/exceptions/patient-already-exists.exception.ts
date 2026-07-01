// Error de dominio para evitar fichas duplicadas de paciente.
export class PatientAlreadyExistsException extends Error {
  constructor(message = 'El paciente ya existe') {
    super(message);
    this.name = 'PatientAlreadyExistsException';
  }
}
