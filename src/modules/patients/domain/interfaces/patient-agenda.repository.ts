import type {
  PatientAgendaDto,
  PatientMedicationsDto,
} from '../../application/dtos/patient-agenda.dto';
export const PATIENT_AGENDA_REPOSITORY = 'PATIENT_AGENDA_REPOSITORY';
export interface PatientAgendaRepository {
  activity(
    patientId: number,
    query: { page?: number; limit?: number },
  ): Promise<unknown>;
  agenda(patientId: number, query: PatientAgendaDto): Promise<unknown>;
  medications(
    patientId: number,
    query: PatientMedicationsDto,
  ): Promise<unknown>;
}
