// Error de dominio usado cuando un usuario autenticado con rol PATIENT no tiene
// un registro Patient asociado; evita devolver datos de otro paciente.
export class PatientProfileNotFoundException extends Error {
  constructor(userId: number) {
    super(`No existe un perfil de paciente relacionado con el usuario ${userId}.`);
    this.name = 'PatientProfileNotFoundException';
  }
}
