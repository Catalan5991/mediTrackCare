import { Inject, Injectable } from '@nestjs/common';

import { DoctorAlreadyExistsException } from '../../domain/exceptions/doctor-already-exists.exception';
import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';
import { UpdateDoctorDto } from '../dtos/update-doctor.dto';
import { InvalidDoctorUserException } from '../../domain/exceptions/invalid-doctor-user.exception';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../../users/domain/interfaces/user-repository.interface';

@Injectable()
export class UpdateDoctorUseCase {
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: number, dto: UpdateDoctorDto) {
    if (!(await this.repository.findById(id))) {
      throw new DoctorNotFoundException(id);
    }
    if (dto.userId !== undefined) {
      const user = await this.usersRepository.findById(dto.userId);
      if (!user || user.role.toUpperCase() !== 'DOCTOR') {
        throw new InvalidDoctorUserException(
          `El usuario con id ${dto.userId} no existe o no tiene rol DOCTOR`,
        );
      }
    }
    if (
      await this.repository.findDuplicateForUpdate(
        id,
        dto.userId,
        dto.professionalLicense,
      )
    ) {
      throw new DoctorAlreadyExistsException(
        'El usuario o la cédula profesional ya pertenecen a otro doctor',
      );
    }
    return this.repository.update(id, dto);
  }
}
