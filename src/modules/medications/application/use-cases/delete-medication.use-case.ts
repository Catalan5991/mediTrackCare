import { Injectable } from '@nestjs/common';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import { MedicationNotFoundException } from '../../domain/exceptions/medication-not-found.exception';
import { MedicationsRepository } from '../../domain/interfaces/medications-repository.interface';

// Realiza borrado logico para mantener historial y referencias clinicas.
@Injectable()
export class DeleteMedicationUseCase {
  constructor(private readonly medicationsRepository: MedicationsRepository) {}

  async execute(id: number): Promise<MedicationEntity> {
    const medication = await this.medicationsRepository.findById(id);

    if (!medication) {
      throw new MedicationNotFoundException(id);
    }

    return this.medicationsRepository.delete(id);
  }
}
