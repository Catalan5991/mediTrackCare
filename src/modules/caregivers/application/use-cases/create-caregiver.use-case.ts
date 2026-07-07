import { Inject, Injectable } from '@nestjs/common';
import { CreateCaregiverDto } from '../dtos/create-caregiver.dto';
import { CaregiverAlreadyExistsException } from '../../domain/exceptions/caregiver-already-exists.exception';
import {
  CAREGIVERS_REPOSITORY,
  CaregiversRepository,
} from '../../domain/interfaces/caregivers.repository.interface';

// Caso de uso responsable de registrar cuidadores. Centraliza la regla de que
// un usuario no puede repetirse como cuidador del mismo paciente, incluso si la
// base de datos tambien protege esta restriccion con un indice unico.
@Injectable()
export class CreateCaregiverUseCase {
  constructor(
    @Inject(CAREGIVERS_REPOSITORY)
    private readonly caregiversRepository: CaregiversRepository,
  ) {}

  async execute(dto: CreateCaregiverDto) {
    // Validacion previa para devolver un error de dominio claro antes de llegar
    // a la restriccion unica de Prisma/PostgreSQL.
    const existingCaregiver =
      await this.caregiversRepository.findByUserAndPatient(
        dto.userId,
        dto.patientId,
      );

    if (existingCaregiver) {
      // El filtro del controller convertira esta excepcion en HTTP 409.
      throw new CaregiverAlreadyExistsException(
        `El usuario con id ${dto.userId} ya esta registrado como cuidador del paciente ${dto.patientId}`,
      );
    }

    return this.caregiversRepository.create(dto);
  }
}
