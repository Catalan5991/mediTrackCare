import { Inject, Injectable } from '@nestjs/common';
import { IntakeNotFoundException } from '../../domain/exceptions/intake-not-found.exception';
import {
  INTAKES_REPOSITORY,
  IntakesRepository,
} from '../../domain/interfaces/intakes.repository.interface';

@Injectable()
// Elimina tomas solo despues de confirmar que el registro existe.
export class DeleteIntakeUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(INTAKES_REPOSITORY)
    private readonly repository: IntakesRepository,
  ) {}
  /**
   * Elimina un toma aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   * @throws {IntakeNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<void> {
    const intake = await this.repository.findById(id);

    // La verificacion evita exponer errores tecnicos del motor de datos.
    if (!intake) {
      throw new IntakeNotFoundException(id);
    }

    await this.repository.delete(id);
  }
}
