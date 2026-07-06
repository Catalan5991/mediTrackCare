import { Inject, Injectable } from '@nestjs/common';
import { MedicalMeasurementNotFoundException } from '../../domain/exceptions/medical-measurement-not-found.exception';
import { MEDICAL_MEASUREMENTS_REPOSITORY, MedicalMeasurementsRepository} from '../../domain/interfaces/medical-measurements.repository.interface';

@Injectable()
// Elimina mediciones solo despues de confirmar que el registro existe.
export class DeleteMedicalMeasurementUseCase {
  constructor(
    @Inject(MEDICAL_MEASUREMENTS_REPOSITORY)
    private readonly repository: MedicalMeasurementsRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const measurement = await this.repository.findById(id);

    // La verificacion evita exponer errores tecnicos del motor de datos.
    if (!measurement) {
      throw new MedicalMeasurementNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
