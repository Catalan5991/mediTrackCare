import { Inject, Injectable } from '@nestjs/common';
import { PATIENT_LINKS_REPOSITORY } from '../../domain/interfaces/patient-links.repository';
import type { PatientLinksRepository } from '../../domain/interfaces/patient-links.repository';
import {
  RequestPatientLinkDto,
  DecidePatientLinkDto,
  LinkKind,
  VerifyDoctorDto,
} from '../dtos/patient-link.dto';
@Injectable()
export class ManagePatientLinksUseCase {
  constructor(
    @Inject(PATIENT_LINKS_REPOSITORY)
    private readonly links: PatientLinksRepository,
  ) {}
  request(dto: RequestPatientLinkDto) {
    return this.links.request(dto);
  }
  list() {
    return this.links.list();
  }
  decide(
    patientId: number,
    userId: number,
    kind: LinkKind,
    dto: DecidePatientLinkDto,
  ) {
    return this.links.decide(patientId, userId, kind, dto);
  }
  verify(doctorId: number, dto: VerifyDoctorDto) {
    return this.links.verify(doctorId, dto);
  }
}
