import { Inject, Injectable } from '@nestjs/common';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';
import { MedicalMeasurementNotFoundException } from '../../domain/exceptions/medical-measurement-not-found.exception';
import {
  MEDICAL_MEASUREMENTS_REPOSITORY,
  MedicalMeasurementsRepository,
} from '../../domain/interfaces/medical-measurements.repository.interface';

@Injectable()
// Centraliza la busqueda por ID y traduce ausencias a una excepcion de dominio.
export class FindMedicalMeasurementByIdUseCase {
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
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {MedicalMeasurementNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<MedicalMeasurementEntity> {
    const measurement = await this.repository.findById(id);

    // Mantiene una respuesta uniforme para recursos inexistentes.
    if (!measurement) {
      throw new MedicalMeasurementNotFoundException(id);
    }

    return measurement;
  }
}
