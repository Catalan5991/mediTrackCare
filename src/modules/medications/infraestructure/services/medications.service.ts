import { Injectable } from '@nestjs/common';
import { CreateMedicationDto } from '../../application/dtos/create-medication.dto';
import { UpdateMedicationDto } from '../../application/dtos/update-medication.dto';
import { CreateMedicationUseCase } from '../../application/use-cases/create-medication.use-case';
import { FindAllMedicationsUseCase } from '../../application/use-cases/find-all-medications.use-case';
import { FindMedicationByIdUseCase } from '../../application/use-cases/find-medication-by-id.use-case';
import { UpdateMedicationUseCase } from '../../application/use-cases/update-medication.use-case';
import { DeleteMedicationUseCase } from '../../application/use-cases/delete-medication.use-case';

// Fachada de infraestructura que expone operaciones del catalogo a controladores.
@Injectable()
export class MedicationsService {
  constructor(
    private readonly createMedicationUseCase: CreateMedicationUseCase,
    private readonly findAllMedicationsUseCase: FindAllMedicationsUseCase,
    private readonly findMedicationByIdUseCase: FindMedicationByIdUseCase,
    private readonly updateMedicationUseCase: UpdateMedicationUseCase,
    private readonly deleteMedicationUseCase: DeleteMedicationUseCase,
  ) {}

  create(dto: CreateMedicationDto) {
    return this.createMedicationUseCase.execute(dto);
  }

  findAll(search?: string, isActive?: boolean) {
    return this.findAllMedicationsUseCase.execute({
      search,
      isActive,
    });
  }

  findById(id: number) {
    return this.findMedicationByIdUseCase.execute(id);
  }

  update(id: number, dto: UpdateMedicationDto) {
    return this.updateMedicationUseCase.execute(id, dto);
  }

  delete(id: number) {
    return this.deleteMedicationUseCase.execute(id);
  }
}
