import { Injectable } from '@nestjs/common';
import { UpdateMedicationDto } from '../dtos/update-medication.dto';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import { MedicationNotFoundException } from '../../domain/exceptions/medication-not-found.exception';
import { MedicationsRepository } from '../../domain/interfaces/medications-repository.interface';

// Actualiza campos parciales solo despues de confirmar que el medicamento existe.
@Injectable()
export class UpdateMedicationUseCase {
  constructor(private readonly medicationsRepository: MedicationsRepository) {}

  async execute(
    id: number,
    dto: UpdateMedicationDto,
  ): Promise<MedicationEntity> {
    const medication = await this.medicationsRepository.findById(id);

    if (!medication) {
      throw new MedicationNotFoundException(id);
    }

    // El repositorio recibe un objeto parcial para conservar valores no enviados.
    return this.medicationsRepository.update(id, dto);
  }
}
