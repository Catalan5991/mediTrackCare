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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}
  /**
   * Actualiza un prescripcion aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {PrescriptionNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
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
