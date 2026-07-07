import { Inject, Injectable } from '@nestjs/common';
import { UpdateIntakeDto } from '../dtos/update-intake.dto';
import { IntakeEntity } from '../../domain/entities/intake.entity';
import { IntakeNotFoundException } from '../../domain/exceptions/intake-not-found.exception';
import {
  INTAKES_REPOSITORY,
  IntakesRepository,
} from '../../domain/interfaces/intakes.repository.interface';

@Injectable()
// Valida existencia antes de aplicar cambios parciales sobre una toma.
export class UpdateIntakeUseCase {
  constructor(
    @Inject(INTAKES_REPOSITORY)
    private readonly repository: IntakesRepository,
  ) {}

  async execute(id: number, dto: UpdateIntakeDto): Promise<IntakeEntity> {
    const intake = await this.repository.findById(id);

    // Se comprueba primero para devolver un error claro antes del update.
    if (!intake) {
      throw new IntakeNotFoundException(id);
    }

    return this.repository.update(id, dto);
  }
}
