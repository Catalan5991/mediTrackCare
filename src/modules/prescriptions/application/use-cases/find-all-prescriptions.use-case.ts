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
  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly repository: PrescriptionRepository,
  ) {}

  execute(filters: FindPrescriptionsFilters): Promise<PaginatedPrescriptions> {
    return this.repository.findAll(filters);
  }
}
