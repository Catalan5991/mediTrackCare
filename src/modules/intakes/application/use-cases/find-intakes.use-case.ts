import { Inject, Injectable } from '@nestjs/common';
import { FindIntakesDto } from '../dtos/find-intakes.dto';
import { InvalidIntakeDateRangeException } from '../../domain/exceptions/invalid-intake-date-range.exception';
import {
  INTAKES_REPOSITORY,
  IntakesPaginatedResponse,
  IntakesRepository,
} from '../../domain/interfaces/intakes.repository.interface';

@Injectable()
// Caso de uso de lectura con validacion de reglas antes de consultar datos.
export class FindIntakesUseCase {
  constructor(
    @Inject(INTAKES_REPOSITORY)
    private readonly repository: IntakesRepository,
  ) {}

  execute(filters: FindIntakesDto): Promise<IntakesPaginatedResponse> {
    // Evita consultas ambiguas cuando el rango de fechas llega invertido.
    if (filters.dateFrom && filters.dateTo) {
      const dateFrom = new Date(filters.dateFrom);
      const dateTo = new Date(filters.dateTo);

      if (dateFrom > dateTo) {
        throw new InvalidIntakeDateRangeException();
      }
    }

    return this.repository.findAll(filters);
  }
}
