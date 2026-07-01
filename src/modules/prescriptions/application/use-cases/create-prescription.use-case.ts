import { Inject, Injectable } from '@nestjs/common';
import {
  CreatePrescriptionInput,
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { InvalidPrescriptionException } from '../../domain/exceptions/invalid-prescription.exception';

@Injectable()
// Caso de uso responsable de validar y registrar una nueva receta.
export class CreatePrescriptionUseCase {
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}

  async execute(data: CreatePrescriptionInput): Promise<PrescriptionEntity> {
    // Una receta valida debe incluir al menos un medicamento.
    if (!data.items || data.items.length === 0) {
      throw new InvalidPrescriptionException(
        'La receta debe contener al menos un medicamento',
      );
    }

    return this.repository.create(data);
  }
}
