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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(INTAKES_REPOSITORY)
    private readonly repository: IntakesRepository,
  ) {}
  /**
   * Obtiene informacion de toma segun los criterios indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   * @throws {InvalidIntakeDateRangeException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
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
