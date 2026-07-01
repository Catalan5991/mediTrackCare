import { Inject, Injectable } from '@nestjs/common';
import {
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
  UpdatePrescriptionInput,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { PrescriptionNotFoundException } from '../../domain/exceptions/prescription-not-found.exception';

@Injectable()
// Caso de uso para modificar una receta despues de confirmar que existe.
export class UpdatePrescriptionUseCase {
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}

  async execute(
    id: number,
    data: UpdatePrescriptionInput,
  ): Promise<PrescriptionEntity> {
    const prescription = await this.repository.findById(id);

    // Evita que el repositorio intente actualizar registros inexistentes.
    if (!prescription) {
      throw new PrescriptionNotFoundException(id);
    }

    return this.repository.update(id, data);
  }
}
