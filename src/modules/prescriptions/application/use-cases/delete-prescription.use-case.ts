import { Inject, Injectable } from '@nestjs/common';
import {
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionNotFoundException } from '../../domain/exceptions/prescription-not-found.exception';

@Injectable()
// Caso de uso para eliminar una receta despues de validar su existencia.
export class DeletePrescriptionUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}
  /**
   * Elimina un prescripcion aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   * @throws {PrescriptionNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<void> {
    const prescription = await this.repository.findById(id);

    if (!prescription) {
      throw new PrescriptionNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
