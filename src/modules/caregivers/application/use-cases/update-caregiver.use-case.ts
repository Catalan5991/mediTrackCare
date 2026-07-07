import { Inject, Injectable } from '@nestjs/common';
import { UpdateCaregiverDto } from '../dtos/update-caregiver.dto';
import { CaregiverAlreadyExistsException } from '../../domain/exceptions/caregiver-already-exists.exception';
import { CaregiverNotFoundException } from '../../domain/exceptions/caregiver-not-found.exception';
import {
  CAREGIVERS_REPOSITORY,
  CaregiversRepository,
} from '../../domain/interfaces/caregivers.repository.interface';

// Caso de uso para actualizaciones parciales. Antes de guardar, verifica que el
// registro exista y que un cambio de userId o patientId no produzca duplicados.
@Injectable()
export class UpdateCaregiverUseCase {
  constructor(
    @Inject(CAREGIVERS_REPOSITORY)
    private readonly caregiversRepository: CaregiversRepository,
  ) {}

  async execute(id: number, dto: UpdateCaregiverDto) {
    // Se consulta primero para diferenciar "no existe" de errores de escritura.
    const caregiver = await this.caregiversRepository.findById(id);

    if (!caregiver) {
      throw new CaregiverNotFoundException(id);
    }

    // Calcula la combinacion final despues del PATCH para validar solo cuando
    // cambia alguno de los campos que componen la restriccion unica.
    const nextUserId = dto.userId ?? caregiver.userId;
    const nextPatientId = dto.patientId ?? caregiver.patientId;

    if (
      nextUserId !== caregiver.userId ||
      nextPatientId !== caregiver.patientId
    ) {
      const existingCaregiver =
        await this.caregiversRepository.findByUserAndPatient(
          nextUserId,
          nextPatientId,
        );

      if (existingCaregiver && existingCaregiver.id !== id) {
        // Evita que dos registros diferentes apunten al mismo usuario-paciente.
        throw new CaregiverAlreadyExistsException(
          `El usuario con id ${nextUserId} ya esta registrado como cuidador del paciente ${nextPatientId}`,
        );
      }
    }

    return this.caregiversRepository.update(id, dto);
  }
}
