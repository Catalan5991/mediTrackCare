import { Inject, Injectable } from '@nestjs/common';

import { DoctorAlreadyExistsException } from '../../domain/exceptions/doctor-already-exists.exception';
import {
  DOCTORS_REPOSITORY,
  DoctorsRepository,
} from '../../domain/interfaces/doctors.repository.interface';
import { CreateDoctorDto } from '../dtos/create-doctor.dto';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../../users/domain/interfaces/user-repository.interface';
import { InvalidDoctorUserException } from '../../domain/exceptions/invalid-doctor-user.exception';

@Injectable()
export class CreateDoctorUseCase {
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(dto: CreateDoctorDto) {
    const user = await this.usersRepository.findById(dto.userId);
    if (!user) {
      throw new InvalidDoctorUserException(
        `El usuario con id ${dto.userId} no existe`,
      );
    }
    if (user.role.toUpperCase() !== 'DOCTOR') {
      throw new InvalidDoctorUserException(
        `El usuario con id ${dto.userId} no tiene rol DOCTOR`,
      );
    }
    if (await this.repository.findByUserId(dto.userId)) {
      throw new DoctorAlreadyExistsException(
        `El usuario con id ${dto.userId} ya tiene un doctor registrado`,
      );
    }
    if (
      dto.professionalLicense &&
      (await this.repository.findByProfessionalLicense(dto.professionalLicense))
    ) {
      throw new DoctorAlreadyExistsException(
        `La cédula profesional ${dto.professionalLicense} ya está registrada`,
      );
    }
    return this.repository.create(dto);
  }
}
