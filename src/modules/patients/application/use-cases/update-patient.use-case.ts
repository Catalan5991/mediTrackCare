import { Inject, Injectable } from '@nestjs/common';
import { UpdatePatientDto } from '../dtos/update-patient.dto';
import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository,
} from '../../domain/interfaces/patients.repository.interface';

// Actualiza datos parciales solo despues de confirmar que el paciente existe.
@Injectable()
export class UpdatePatientUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param patientsRepository Repositorio utilizado para persistir y consultar patients repository.
   */
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) {}
  /**
   * Actualiza un paciente aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {PatientNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number, dto: UpdatePatientDto) {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    // El repositorio conserva los campos que no fueron enviados.
    return this.patientsRepository.update(id, dto);
  }
}
