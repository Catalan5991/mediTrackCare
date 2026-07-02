import { Inject, Injectable } from '@nestjs/common';
import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository,
} from '../../domain/interfaces/patients.repository.interface';

// Realiza borrado logico para preservar historial y relaciones clinicas.
@Injectable()
export class DeletePatientUseCase {
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) {}

  async execute(id: number) {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    return this.patientsRepository.softDelete(id);
  }
}
