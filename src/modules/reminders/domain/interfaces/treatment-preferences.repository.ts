import type { TreatmentPreferencesDto } from '../../application/dtos/treatment-preferences.dto';
export const TREATMENT_PREFERENCES = 'TREATMENT_PREFERENCES';
export interface TreatmentPreferencesRepository {
  configure(itemId: number, dto: TreatmentPreferencesDto): Promise<unknown>;
}
