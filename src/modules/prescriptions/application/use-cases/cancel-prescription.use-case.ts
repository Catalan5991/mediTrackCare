import { Inject, Injectable } from '@nestjs/common';
import { PrescriptionStatus } from '../../../../../generated/prisma/client';
import {
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { PrescriptionNotFoundException } from '../../domain/exceptions/prescription-not-found.exception';

@Injectable()
// Caso de uso para cancelar una receta existente.
export class CancelPrescriptionUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}
  /**
   * Ejecuta el caso de uso de prescripcion.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {PrescriptionNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<PrescriptionEntity> {
    const prescription = await this.repository.findById(id);

    if (!prescription) {
      throw new PrescriptionNotFoundException(id);
    }

    // La ruta de cancelación debe reflejar el estado CANCELADO del dominio.
    return this.repository.update(id, {
      status: PrescriptionStatus.CANCELADO,
    });
  }
}
