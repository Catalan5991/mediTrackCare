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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param caregiversRepository Repositorio utilizado para persistir y consultar caregivers repository.
   */
  constructor(
    @Inject(CAREGIVERS_REPOSITORY)
    private readonly caregiversRepository: CaregiversRepository,
  ) {}
  /**
   * Crea un cuidador aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {CaregiverAlreadyExistsException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
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
