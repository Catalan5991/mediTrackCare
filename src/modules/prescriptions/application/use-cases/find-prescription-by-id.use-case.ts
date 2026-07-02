import { Inject, Injectable } from '@nestjs/common';
import {
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { PrescriptionNotFoundException } from '../../domain/exceptions/prescription-not-found.exception';

@Injectable()
// Caso de uso para consultar una receta especifica y fallar si no existe.
export class FindPrescriptionByIdUseCase {
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}

  async execute(id: number): Promise<PrescriptionEntity> {
    const prescription = await this.repository.findById(id);

    // Centraliza la validacion de existencia para responder con una excepcion de dominio.
    if (!prescription) {
      throw new PrescriptionNotFoundException(id);
    }

    return prescription;
  }
}
