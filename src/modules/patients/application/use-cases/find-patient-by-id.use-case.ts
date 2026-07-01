import { Inject, Injectable } from '@nestjs/common';
import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository,
} from '../../domain/interfaces/patients.repository.interface';

// Recupera una ficha de paciente y traduce ausencias a error de dominio.
@Injectable()
export class FindPatientByIdUseCase {
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) {}

  async execute(id: number) {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      throw new PatientNotFoundException(id);
    }

    return patient;
  }
}
