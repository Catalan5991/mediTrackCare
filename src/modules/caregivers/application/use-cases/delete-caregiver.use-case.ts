import { Inject, Injectable } from '@nestjs/common';
import { CaregiverNotFoundException } from '../../domain/exceptions/caregiver-not-found.exception';
import {
  CAREGIVERS_REPOSITORY,
  CaregiversRepository,
} from '../../domain/interfaces/caregivers.repository.interface';

// Caso de uso de eliminacion logica. En lugar de borrar fisicamente, desactiva
// la relacion para conservar historial y no romper referencias clinicas.
@Injectable()
export class DeleteCaregiverUseCase {
  constructor(
    @Inject(CAREGIVERS_REPOSITORY)
    private readonly caregiversRepository: CaregiversRepository,
  ) {}

  async execute(id: number) {
    // Confirma existencia para responder 404 cuando el id no pertenece a nadie.
    const caregiver = await this.caregiversRepository.findById(id);

    if (!caregiver) {
      throw new CaregiverNotFoundException(id);
    }

    return this.caregiversRepository.softDelete(id);
  }
}
