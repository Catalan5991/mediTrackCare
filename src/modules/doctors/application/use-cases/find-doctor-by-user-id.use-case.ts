import { Inject, Injectable } from '@nestjs/common';

import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';

@Injectable()
export class FindDoctorByUserIdUseCase {
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
  ) {}

  async execute(userId: number) {
    const doctor = await this.repository.findByUserId(userId);
    if (!doctor) throw new DoctorNotFoundException(userId);
    return doctor;
  }
}
