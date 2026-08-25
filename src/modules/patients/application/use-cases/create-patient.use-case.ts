import { Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository,
} from '../../domain/interfaces/patients.repository.interface';
import { PatientAlreadyExistsException } from '../../domain/exceptions/patient-already-exists.exception';

// Crea pacientes evitando duplicar la ficha asociada a un mismo usuario.
@Injectable()
export class CreatePatientUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param patientsRepository Repositorio utilizado para persistir y consultar patients repository.
   */
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) {}
  /**
   * Crea un paciente aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {PatientAlreadyExistsException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(dto: CreatePatientDto) {
    if (dto.userId) {
      // Un usuario solo puede tener un registro de paciente asociado.
      const existingPatient = await this.patientsRepository.findByUserId(
        dto.userId,
      );

      if (existingPatient) {
        throw new PatientAlreadyExistsException(
          `El usuario con id ${dto.userId} ya tiene un paciente registrado`,
        );
      }
    }

    return this.patientsRepository.create(dto);
  }
}
