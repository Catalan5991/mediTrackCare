import { Inject, Injectable } from '@nestjs/common';
import { CreateMedicalMeasurementDto } from '../dtos/create-medical-measurement.dto';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';
import { MEDICAL_MEASUREMENTS_REPOSITORY, MedicalMeasurementsRepository } from '../../domain/interfaces/medical-measurements.repository.interface';

@Injectable()
// Caso de uso encargado de delegar el registro de mediciones al repositorio.
export class CreateMedicalMeasurementUseCase {
  constructor(
    @Inject(MEDICAL_MEASUREMENTS_REPOSITORY)
    private readonly repository: MedicalMeasurementsRepository,
  ) {}

  execute(
    dto: CreateMedicalMeasurementDto,
  ): Promise<MedicalMeasurementEntity> {
    // La persistencia valida relaciones y transforma los valores decimales.
    return this.repository.create(dto);
  }
}
