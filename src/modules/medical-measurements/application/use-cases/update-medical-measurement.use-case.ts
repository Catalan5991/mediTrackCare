import { Inject, Injectable } from '@nestjs/common';
import { UpdateMedicalMeasurementDto } from '../dtos/update-medical-measurement.dto';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';
import { MedicalMeasurementNotFoundException } from '../../domain/exceptions/medical-measurement-not-found.exception';
import { MEDICAL_MEASUREMENTS_REPOSITORY, MedicalMeasurementsRepository } from '../../domain/interfaces/medical-measurements.repository.interface';

@Injectable()
// Valida existencia antes de aplicar cambios parciales sobre una medicion.
export class UpdateMedicalMeasurementUseCase {
  constructor(
    @Inject(MEDICAL_MEASUREMENTS_REPOSITORY)
    private readonly repository: MedicalMeasurementsRepository,
  ) {}

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
