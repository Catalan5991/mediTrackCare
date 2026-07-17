import { Inject, Injectable } from '@nestjs/common';

import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import { DoctorInactiveException } from '../../domain/exceptions/doctor-inactive.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';

@Injectable()
export class DeleteDoctorUseCase {
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
  ) {}

  async execute(id: number) {
    const doctor = await this.repository.findById(id);
    if (!doctor) {
      throw new DoctorNotFoundException(id);
    }
    if (!doctor.isActive) throw new DoctorInactiveException(id);
    return this.repository.softDelete(id);
  }
}
