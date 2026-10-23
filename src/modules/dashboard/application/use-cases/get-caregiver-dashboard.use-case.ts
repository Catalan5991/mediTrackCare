import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import { PATIENTS_REPOSITORY } from '../../../patients/domain/interfaces/patients.repository.interface';
import type { PatientsRepository } from '../../../patients/domain/interfaces/patients.repository.interface';
import { PATIENT_AGENDA_REPOSITORY } from '../../../patients/domain/interfaces/patient-agenda.repository';
import type { PatientAgendaRepository } from '../../../patients/domain/interfaces/patient-agenda.repository';
import { QueryPatientDto } from '../../../patients/application/dtos/query-patient.dto';
import { PatientAgendaDto } from '../../../patients/application/dtos/patient-agenda.dto';
@Injectable()
export class GetCaregiverDashboardUseCase {
  constructor(
    @Inject(PATIENTS_REPOSITORY) private readonly patients: PatientsRepository,
    @Inject(PATIENT_AGENDA_REPOSITORY)
    private readonly agenda: PatientAgendaRepository,
    private readonly access: PatientAccessService,
  ) {}
  async execute(query: QueryPatientDto) {
    if (
      !['ADMIN', 'CAREGIVER'].includes(this.access.actor().role.toUpperCase())
    )
      throw new ForbiddenException();
    const result = await this.patients.findAll({
      ...query,
      limit: Math.min(query.limit ?? 10, 20),
    });
    return {
      ...result,
      data: await Promise.all(
        result.data.map(async (patient) => ({
          patient,
          agenda: await this.agenda.agenda(patient.id, new PatientAgendaDto()),
        })),
      ),
    };
  }
}
