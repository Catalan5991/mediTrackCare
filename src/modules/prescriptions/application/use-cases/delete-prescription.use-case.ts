import { Inject, Injectable } from '@nestjs/common';
import {
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionNotFoundException } from '../../domain/exceptions/prescription-not-found.exception';

@Injectable()
// Caso de uso para eliminar una receta despues de validar su existencia.
export class DeletePrescriptionUseCase {
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const prescription = await this.repository.findById(id);

    if (!prescription) {
      throw new PrescriptionNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
