import { Inject, Injectable } from '@nestjs/common';
import { UpdateMedicalMeasurementDto } from '../dtos/update-medical-measurement.dto';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';
import { MedicalMeasurementNotFoundException } from '../../domain/exceptions/medical-measurement-not-found.exception';
import {
  MEDICAL_MEASUREMENTS_REPOSITORY,
  MedicalMeasurementsRepository,
} from '../../domain/interfaces/medical-measurements.repository.interface';

@Injectable()
// Valida existencia antes de aplicar cambios parciales sobre una medicion.
export class UpdateMedicalMeasurementUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(MEDICAL_MEASUREMENTS_REPOSITORY)
    private readonly repository: MedicalMeasurementsRepository,
  ) {}
  /**
   * Actualiza un medicion medica aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {MedicalMeasurementNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(
    id: number,
    dto: UpdateMedicalMeasurementDto,
  ): Promise<MedicalMeasurementEntity> {
    const measurement = await this.repository.findById(id);

    // Se comprueba primero para devolver un error claro antes del update.
    if (!measurement) {
      throw new MedicalMeasurementNotFoundException(id);
    }

    return this.repository.update(id, dto);
  }
}
