import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TREATMENT_PREFERENCES } from '../../domain/interfaces/treatment-preferences.repository';
import type { TreatmentPreferencesRepository } from '../../domain/interfaces/treatment-preferences.repository';
import { TreatmentPreferencesDto } from '../dtos/treatment-preferences.dto';
@Injectable()
export class ConfigureTreatmentPreferencesUseCase {
  constructor(
    @Inject(TREATMENT_PREFERENCES)
    private readonly preferences: TreatmentPreferencesRepository,
  ) {}
  execute(id: number, dto: TreatmentPreferencesDto) {
    if (dto.repeatCount && !dto.repeatMinutes)
      throw new BadRequestException('La repeticion requiere un intervalo.');
    return this.preferences.configure(id, dto);
  }
}
