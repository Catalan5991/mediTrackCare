import { Injectable } from '@nestjs/common';

import { CreateDoctorDto } from '../../application/dtos/create-doctor.dto';
import { QueryDoctorDto } from '../../application/dtos/query-doctor.dto';
import { UpdateDoctorDto } from '../../application/dtos/update-doctor.dto';
import { CreateDoctorUseCase } from '../../application/use-cases/create-doctor.use-case';
import { DeleteDoctorUseCase } from '../../application/use-cases/delete-doctor.use-case';
import { FindAllDoctorsUseCase } from '../../application/use-cases/find-all-doctors.use-case';
import { FindDoctorByIdUseCase } from '../../application/use-cases/find-doctor-by-id.use-case';
import { FindDoctorByUserIdUseCase } from '../../application/use-cases/find-doctor-by-user-id.use-case';
import { UpdateDoctorUseCase } from '../../application/use-cases/update-doctor.use-case';
import { ManageDoctorPatientsUseCase } from '../../application/use-cases/manage-doctor-patients.use-case';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly createDoctor: CreateDoctorUseCase,
    private readonly findAllDoctors: FindAllDoctorsUseCase,
    private readonly findDoctorById: FindDoctorByIdUseCase,
    private readonly findDoctorByUserId: FindDoctorByUserIdUseCase,
    private readonly updateDoctor: UpdateDoctorUseCase,
    private readonly deleteDoctor: DeleteDoctorUseCase,
    private readonly managePatients: ManageDoctorPatientsUseCase,
  ) {}

  create(dto: CreateDoctorDto) {
    return this.createDoctor.execute(dto);
  }
  findAll(query: QueryDoctorDto) {
    return this.findAllDoctors.execute(query);
  }
  findOne(id: number) {
    return this.findDoctorById.execute(id);
  }
  findMine(userId: number) {
    return this.findDoctorByUserId.execute(userId);
  }
  update(id: number, dto: UpdateDoctorDto) {
    return this.updateDoctor.execute(id, dto);
  }
  remove(id: number) {
    return this.deleteDoctor.execute(id);
  }
  assignPatient(doctorId: number, patientId: number) {
    return this.managePatients.assign(doctorId, patientId);
  }
  removePatient(doctorId: number, patientId: number) {
    return this.managePatients.remove(doctorId, patientId);
  }
  findPatients(doctorId: number) {
    return this.managePatients.findAll(doctorId);
  }
}
