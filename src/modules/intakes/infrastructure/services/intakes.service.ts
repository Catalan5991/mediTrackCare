import { Injectable } from '@nestjs/common';

import { CreateIntakeDto } from '../../application/dtos/create-intake.dto';
import { FindIntakesDto } from '../../application/dtos/find-intakes.dto';
import { UpdateIntakeDto } from '../../application/dtos/update-intake.dto';
import { CreateIntakeUseCase } from '../../application/use-cases/create-intake.use-case';
import { DeleteIntakeUseCase } from '../../application/use-cases/delete-intake.use-case';
import { FindIntakeByIdUseCase } from '../../application/use-cases/find-intake-by-id.use-case';
import { FindIntakesUseCase } from '../../application/use-cases/find-intakes.use-case';
import { UpdateIntakeUseCase } from '../../application/use-cases/update-intake.use-case';

@Injectable()
// Fachada de infraestructura que mantiene el controller desacoplado de los casos de uso.
export class IntakesService {
  constructor(
    private readonly createIntakeUseCase: CreateIntakeUseCase,
    private readonly findIntakesUseCase: FindIntakesUseCase,
    private readonly findIntakeByIdUseCase: FindIntakeByIdUseCase,
    private readonly updateIntakeUseCase: UpdateIntakeUseCase,
    private readonly deleteIntakeUseCase: DeleteIntakeUseCase,
  ) {}

  create(dto: CreateIntakeDto) {
    // Cada metodo delega una accion HTTP en su caso de uso correspondiente.
    return this.createIntakeUseCase.execute(dto);
  }

  findAll(filters: FindIntakesDto) {
    return this.findIntakesUseCase.execute(filters);
  }

  findOne(id: number) {
    return this.findIntakeByIdUseCase.execute(id);
  }

  update(id: number, dto: UpdateIntakeDto) {
    return this.updateIntakeUseCase.execute(id, dto);
  }

  remove(id: number) {
    return this.deleteIntakeUseCase.execute(id);
  }
}
