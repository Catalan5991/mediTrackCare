import { Inject, Injectable } from '@nestjs/common';
import { FindMedicalMeasurementsDto } from '../dtos/find-medical-measurements.dto';
import {
  MEDICAL_MEASUREMENTS_REPOSITORY,
  MedicalMeasurementsPaginatedResponse,
  MedicalMeasurementsRepository,
} from '../../domain/interfaces/medical-measurements.repository.interface';
import { InvalidMeasurementDateRangeException } from '../../domain/exceptions/invalid-measurement-date-range.exception';

@Injectable()
// Caso de uso de lectura con validacion de reglas antes de consultar datos.
export class FindMedicalMeasurementsUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(MEDICAL_MEASUREMENTS_REPOSITORY)
    private readonly repository: MedicalMeasurementsRepository,
  ) {}
  /**
   * Obtiene informacion de medicion medica segun los criterios indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   * @throws {InvalidMeasurementDateRangeException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  execute(
    filters: FindMedicalMeasurementsDto,
  ): Promise<MedicalMeasurementsPaginatedResponse> {
    // Evita consultas ambiguas cuando el rango de fechas llega invertido.
    if (filters.dateFrom && filters.dateTo) {
      const dateFrom = new Date(filters.dateFrom);
      const dateTo = new Date(filters.dateTo);

      if (dateFrom > dateTo) {
        throw new InvalidMeasurementDateRangeException();
      }
    }

    return this.repository.findAll(filters);
  }
}
