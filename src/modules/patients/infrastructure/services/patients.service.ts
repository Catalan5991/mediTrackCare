import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from '../../application/dtos/create-patient.dto';
import { QueryPatientDto } from '../../application/dtos/query-patient.dto';
import { UpdatePatientDto } from '../../application/dtos/update-patient.dto';
import { CreatePatientUseCase } from '../../application/use-cases/create-patient.use-case';
import { DeletePatientUseCase } from '../../application/use-cases/delete-patient.use-case';
import { FindAllPatientsUseCase } from '../../application/use-cases/find-all-patients.use-case';
import { FindPatientByIdUseCase } from '../../application/use-cases/find-patient-by-id.use-case';
import { UpdatePatientUseCase } from '../../application/use-cases/update-patient.use-case';

// Fachada de infraestructura que delega operaciones HTTP a casos de uso.
@Injectable()
export class PatientsService {
  constructor(
    private readonly createPatientUseCase: CreatePatientUseCase,
    private readonly findAllPatientsUseCase: FindAllPatientsUseCase,
    private readonly findPatientByIdUseCase: FindPatientByIdUseCase,
    private readonly updatePatientUseCase: UpdatePatientUseCase,
    private readonly deletePatientUseCase: DeletePatientUseCase,
  ) {}

  create(dto: CreatePatientDto) {
    return this.createPatientUseCase.execute(dto);
  }

  findAll(query: QueryPatientDto) {
    return this.findAllPatientsUseCase.execute(query);
  }

  findOne(id: number) {
    return this.findPatientByIdUseCase.execute(id);
  }

  update(id: number, dto: UpdatePatientDto) {
    return this.updatePatientUseCase.execute(id, dto);
  }

  remove(id: number) {
    return this.deletePatientUseCase.execute(id);
  }
}
