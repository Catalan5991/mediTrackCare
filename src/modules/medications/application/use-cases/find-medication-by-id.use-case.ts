import { Injectable } from '@nestjs/common';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import { MedicationNotFoundException } from '../../domain/exceptions/medication-not-found.exception';
import { MedicationsRepository } from '../../domain/interfaces/medications-repository.interface';
 
@Injectable()
export class FindMedicationByIdUseCase {
  constructor(
    private readonly medicationsRepository: MedicationsRepository,
  ) {}

  async execute(id: number): Promise<MedicationEntity> {
    const medication = await this.medicationsRepository.findById(id);

    if (!medication) {
      throw new MedicationNotFoundException(id);
    }

    return medication;
  }
}