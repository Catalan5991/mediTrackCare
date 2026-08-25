import { Inject, Injectable } from '@nestjs/common';
import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository,
} from '../../domain/interfaces/patients.repository.interface';

// Realiza borrado logico para preservar historial y relaciones clinicas.
@Injectable()
export class DeletePatientUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param patientsRepository Repositorio utilizado para persistir y consultar patients repository.
   */
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) {}
  /**
   * Elimina un paciente aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {PatientNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number) {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    return this.patientsRepository.softDelete(id);
  }
}
