import { Inject, Injectable } from '@nestjs/common';
import { PATIENT_AGENDA_REPOSITORY } from '../../domain/interfaces/patient-agenda.repository';
import type { PatientAgendaRepository } from '../../domain/interfaces/patient-agenda.repository';
import {
  PatientAgendaDto,
  PatientMedicationsDto,
} from '../dtos/patient-agenda.dto';
@Injectable()
export class GetPatientAgendaUseCase {
  constructor(
    @Inject(PATIENT_AGENDA_REPOSITORY)
    private readonly repository: PatientAgendaRepository,
  ) {}
  activity(patientId: number, query: { page?: number; limit?: number }) {
    return this.repository.activity(patientId, query);
  }
  agenda(patientId: number, query: PatientAgendaDto) {
    return this.repository.agenda(patientId, query);
  }
  medications(patientId: number, query: PatientMedicationsDto) {
    return this.repository.medications(patientId, query);
  }
}
