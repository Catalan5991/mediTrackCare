import { Inject, Injectable } from '@nestjs/common';

import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';
import { QueryDoctorDto } from '../dtos/query-doctor.dto';

@Injectable()
export class FindAllDoctorsUseCase {
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
  ) {}

  execute(query: QueryDoctorDto) {
    return this.repository.findAll({
      ...query,
      isActive: query.isActive ?? true,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }
}
