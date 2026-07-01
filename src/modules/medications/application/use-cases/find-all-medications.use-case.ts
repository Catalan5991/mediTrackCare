import { Injectable } from '@nestjs/common';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import {FindAllMedicationsParams,MedicationsRepository } from '../../domain/interfaces/medications-repository.interface';

@Injectable()
export class FindAllMedicationsUseCase {
  constructor(
    private readonly medicationsRepository: MedicationsRepository,
  ) {}

  async execute(
    params?: FindAllMedicationsParams,
  ): Promise<MedicationEntity[]> {
    return this.medicationsRepository.findAll(params);
  }
}