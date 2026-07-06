import { Inject, Injectable } from '@nestjs/common';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';
import { MedicalMeasurementNotFoundException } from '../../domain/exceptions/medical-measurement-not-found.exception';
import { MEDICAL_MEASUREMENTS_REPOSITORY, MedicalMeasurementsRepository } from '../../domain/interfaces/medical-measurements.repository.interface';

@Injectable()
// Centraliza la busqueda por ID y traduce ausencias a una excepcion de dominio.
export class FindMedicalMeasurementByIdUseCase {
  constructor(
    @Inject(MEDICAL_MEASUREMENTS_REPOSITORY)
    private readonly repository: MedicalMeasurementsRepository,
  ) {}

  async execute(id: number): Promise<MedicalMeasurementEntity> {
    const measurement = await this.repository.findById(id);

    // Mantiene una respuesta uniforme para recursos inexistentes.
    if (!measurement) {
      throw new MedicalMeasurementNotFoundException(id);
    }

    return measurement;
  }
}
