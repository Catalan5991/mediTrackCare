import { Inject, Injectable } from '@nestjs/common';
import { CreateMedicalMeasurementDto } from '../dtos/create-medical-measurement.dto';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';
import {
  MEDICAL_MEASUREMENTS_REPOSITORY,
  MedicalMeasurementsRepository,
} from '../../domain/interfaces/medical-measurements.repository.interface';

@Injectable()
// Caso de uso encargado de delegar el registro de mediciones al repositorio.
export class CreateMedicalMeasurementUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(MEDICAL_MEASUREMENTS_REPOSITORY)
    private readonly repository: MedicalMeasurementsRepository,
  ) {}
  /**
   * Crea un medicion medica aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(dto: CreateMedicalMeasurementDto): Promise<MedicalMeasurementEntity> {
    // La persistencia valida relaciones y transforma los valores decimales.
    return this.repository.create(dto);
  }
}
