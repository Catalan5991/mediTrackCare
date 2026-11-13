import { Inject, Injectable } from '@nestjs/common';
import { MedicalMeasurementNotFoundException } from '../../domain/exceptions/medical-measurement-not-found.exception';
import {
  MEDICAL_MEASUREMENTS_REPOSITORY,
  MedicalMeasurementsRepository,
} from '../../domain/interfaces/medical-measurements.repository.interface';

@Injectable()
// Elimina mediciones solo despues de confirmar que el registro existe.
export class DeleteMedicalMeasurementUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(MEDICAL_MEASUREMENTS_REPOSITORY)
    private readonly repository: MedicalMeasurementsRepository,
  ) {}
  /**
   * Elimina un medicion medica aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   * @throws {MedicalMeasurementNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<void> {
    const measurement = await this.repository.findById(id);

    // La verificacion evita exponer errores tecnicos del motor de datos.
    if (!measurement) {
      throw new MedicalMeasurementNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
