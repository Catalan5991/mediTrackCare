// Error de dominio para bloquear relaciones duplicadas entre el mismo usuario
// cuidador y el mismo paciente. El filtro HTTP lo transforma en 409 Conflict.
export class CaregiverAlreadyExistsException extends Error {
  constructor(message = 'El cuidador ya existe para el paciente indicado') {
    super(message);
    this.name = 'CaregiverAlreadyExistsException';
  }
}
