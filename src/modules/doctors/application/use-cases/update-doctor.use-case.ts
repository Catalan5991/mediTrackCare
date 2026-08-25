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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   * @param usersRepository Repositorio utilizado para persistir y consultar users repository.
   */
  constructor(
    @Inject(DOCTORS_REPOSITORY)
    private readonly repository: DoctorsRepository,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}
  /**
   * Actualiza un medico aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {DoctorNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   * @throws {InvalidDoctorUserException} Cuando los datos o el estado incumplen la regla de negocio validada.
   * @throws {DoctorAlreadyExistsException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
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
