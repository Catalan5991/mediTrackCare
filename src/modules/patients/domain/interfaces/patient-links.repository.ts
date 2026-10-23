import type {
  LinkKind,
  RequestPatientLinkDto,
  DecidePatientLinkDto,
  VerifyDoctorDto,
} from '../../application/dtos/patient-link.dto';
export const PATIENT_LINKS_REPOSITORY = 'PATIENT_LINKS_REPOSITORY';
export interface PatientLinksRepository {
  request(dto: RequestPatientLinkDto): Promise<unknown>;
  list(): Promise<unknown>;
  decide(
    patientId: number,
    userId: number,
    kind: LinkKind,
    dto: DecidePatientLinkDto,
  ): Promise<unknown>;
  verify(doctorId: number, dto: VerifyDoctorDto): Promise<unknown>;
}
