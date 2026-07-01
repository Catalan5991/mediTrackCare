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
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) {}

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
