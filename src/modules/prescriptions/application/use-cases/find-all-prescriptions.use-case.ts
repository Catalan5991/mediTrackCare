import { Inject, Injectable } from '@nestjs/common';
import {
  FindPrescriptionsFilters,
  PaginatedPrescriptions,
  PRESCRIPTION_REPOSITORY,
  PrescriptionRepository,
} from '../../domain/interfaces/prescription-repository.interface';

@Injectable()
// Caso de uso para obtener recetas paginadas con filtros opcionales.
export class FindAllPrescriptionsUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}
  /**
   * Obtiene informacion de prescripcion segun los criterios indicados.
   * @param filters Valor de filters requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(filters: FindPrescriptionsFilters): Promise<PaginatedPrescriptions> {
    return this.repository.findAll(filters);
  }
}
