// Error de dominio usado cuando un usuario autenticado con rol PATIENT no tiene
// un registro Patient asociado; evita devolver datos de otro paciente.
export class PatientProfileNotFoundException extends Error {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param userId Valor de user id requerido por la operacion.
   */
  constructor(userId: number) {
    super(
      `No existe un perfil de paciente relacionado con el usuario ${userId}.`,
    );
    this.name = 'PatientProfileNotFoundException';
  }
}
