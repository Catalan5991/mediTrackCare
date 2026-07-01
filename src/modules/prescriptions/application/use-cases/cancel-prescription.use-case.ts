import { Inject, Injectable } from '@nestjs/common';
import { PrescriptionStatus } from '../../../../../generated/prisma/client';
import {
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { PrescriptionNotFoundException } from '../../domain/exceptions/prescription-not-found.exception';

@Injectable()
// Caso de uso para cerrar el ciclo de una receta existente.
export class CancelPrescriptionUseCase {
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}

  async execute(id: number): Promise<PrescriptionEntity> {
    const prescription = await this.repository.findById(id);

    if (!prescription) {
      throw new PrescriptionNotFoundException(id);
    }

    // La regla actual marca la receta como finalizada al ejecutar la ruta de cancelacion.
    return this.repository.update(id, {
      status: PrescriptionStatus.FINALIZADO,
    });
  }
}
