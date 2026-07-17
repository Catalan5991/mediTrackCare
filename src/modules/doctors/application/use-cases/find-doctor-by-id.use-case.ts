import { Inject, Injectable } from '@nestjs/common';

import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';

@Injectable()
export class FindDoctorByIdUseCase {
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
  ) {}

  async execute(id: number) {
    const doctor = await this.repository.findById(id);
    if (!doctor) throw new DoctorNotFoundException(id);
    return doctor;
  }
}
