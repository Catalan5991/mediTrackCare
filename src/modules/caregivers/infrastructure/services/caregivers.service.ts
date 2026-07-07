import { Injectable } from '@nestjs/common';
import { CreateCaregiverDto } from '../../application/dtos/create-caregiver.dto';
import { QueryCaregiverDto } from '../../application/dtos/query-caregiver.dto';
import { UpdateCaregiverDto } from '../../application/dtos/update-caregiver.dto';
import { CreateCaregiverUseCase } from '../../application/use-cases/create-caregiver.use-case';
import { DeleteCaregiverUseCase } from '../../application/use-cases/delete-caregiver.use-case';
import { FindAllCaregiversUseCase } from '../../application/use-cases/find-all-caregivers.use-case';
import { FindCaregiverByIdUseCase } from '../../application/use-cases/find-caregiver-by-id.use-case';
import { UpdateCaregiverUseCase } from '../../application/use-cases/update-caregiver.use-case';

// Servicio usado por el controller como fachada de infraestructura. No contiene
// reglas de negocio: cada metodo delega en un caso de uso especifico para que
// la orquestacion de la aplicacion permanezca en la capa application.
@Injectable()
export class CaregiversService {
  constructor(
    private readonly createCaregiverUseCase: CreateCaregiverUseCase,
    private readonly findAllCaregiversUseCase: FindAllCaregiversUseCase,
    private readonly findCaregiverByIdUseCase: FindCaregiverByIdUseCase,
    private readonly updateCaregiverUseCase: UpdateCaregiverUseCase,
    private readonly deleteCaregiverUseCase: DeleteCaregiverUseCase,
  ) {}

  create(dto: CreateCaregiverDto) {
    return this.createCaregiverUseCase.execute(dto);
  }

  findAll(query: QueryCaregiverDto) {
    return this.findAllCaregiversUseCase.execute(query);
  }

  findOne(id: number) {
    return this.findCaregiverByIdUseCase.execute(id);
  }

  update(id: number, dto: UpdateCaregiverDto) {
    return this.updateCaregiverUseCase.execute(id, dto);
  }

  remove(id: number) {
    return this.deleteCaregiverUseCase.execute(id);
  }
}
