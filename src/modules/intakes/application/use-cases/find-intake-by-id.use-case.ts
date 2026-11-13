import { Inject, Injectable } from '@nestjs/common';
import { IntakeEntity } from '../../domain/entities/intake.entity';
import { IntakeNotFoundException } from '../../domain/exceptions/intake-not-found.exception';
import {
  INTAKES_REPOSITORY,
  IntakesRepository,
} from '../../domain/interfaces/intakes.repository.interface';

@Injectable()
// Centraliza la busqueda por ID y traduce ausencias a una excepcion de dominio.
export class FindIntakeByIdUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(INTAKES_REPOSITORY)
    private readonly repository: IntakesRepository,
  ) {}
  /**
   * Obtiene informacion de toma segun los criterios indicados.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {IntakeNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<IntakeEntity> {
    const intake = await this.repository.findById(id);

    // Mantiene una respuesta uniforme para recursos inexistentes.
    if (!intake) {
      throw new IntakeNotFoundException(id);
    }

    return intake;
  }
}
