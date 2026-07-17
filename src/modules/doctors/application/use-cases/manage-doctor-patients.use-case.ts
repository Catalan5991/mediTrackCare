import { Inject, Injectable } from '@nestjs/common';

import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';

@Injectable()
export class ManageDoctorPatientsUseCase {
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
  ) {}

  private async assertDoctor(doctorId: number): Promise<void> {
    if (!(await this.repository.findById(doctorId))) {
      throw new DoctorNotFoundException(doctorId);
    }
  }

  async assign(doctorId: number, patientId: number) {
    await this.assertDoctor(doctorId);
    return this.repository.assignPatient(doctorId, patientId);
  }

  async remove(doctorId: number, patientId: number) {
    await this.assertDoctor(doctorId);
    return this.repository.removePatient(doctorId, patientId);
  }

  async findAll(doctorId: number) {
    await this.assertDoctor(doctorId);
    return this.repository.findPatientAssignments(doctorId);
  }
}
