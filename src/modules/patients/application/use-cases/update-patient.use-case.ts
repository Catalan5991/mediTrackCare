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
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) {}

  async execute(id: number, dto: UpdatePatientDto) {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    // El repositorio conserva los campos que no fueron enviados.
    return this.patientsRepository.update(id, dto);
  }
}
