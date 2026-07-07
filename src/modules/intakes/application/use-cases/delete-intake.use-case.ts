import { Inject, Injectable } from '@nestjs/common';
import { IntakeNotFoundException } from '../../domain/exceptions/intake-not-found.exception';
import {
  INTAKES_REPOSITORY,
  IntakesRepository,
} from '../../domain/interfaces/intakes.repository.interface';

@Injectable()
// Elimina tomas solo despues de confirmar que el registro existe.
export class DeleteIntakeUseCase {
  constructor(
    @Inject(INTAKES_REPOSITORY)
    private readonly repository: IntakesRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const intake = await this.repository.findById(id);

    // La verificacion evita exponer errores tecnicos del motor de datos.
    if (!intake) {
      throw new IntakeNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
