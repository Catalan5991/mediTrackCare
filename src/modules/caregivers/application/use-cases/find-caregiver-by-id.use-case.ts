import { Inject, Injectable } from '@nestjs/common';
import { CaregiverNotFoundException } from '../../domain/exceptions/caregiver-not-found.exception';
import {
  CAREGIVERS_REPOSITORY,
  CaregiversRepository,
} from '../../domain/interfaces/caregivers.repository.interface';

// Caso de uso de detalle. La ausencia de registro se expresa como excepcion de
// dominio para que la capa HTTP pueda responder 404 de forma uniforme.
@Injectable()
export class FindCaregiverByIdUseCase {
  constructor(
    @Inject(CAREGIVERS_REPOSITORY)
    private readonly caregiversRepository: CaregiversRepository,
  ) {}

  async execute(id: number) {
    const caregiver = await this.caregiversRepository.findById(id);

    if (!caregiver) {
      throw new CaregiverNotFoundException(id);
    }

    return caregiver;
  }
}
