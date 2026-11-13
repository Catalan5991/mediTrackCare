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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(INTAKES_REPOSITORY)
    private readonly repository: IntakesRepository,
  ) {}
  /**
   * Actualiza un toma aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {IntakeNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number, dto: UpdateIntakeDto): Promise<IntakeEntity> {
    const intake = await this.repository.findById(id);

    // Se comprueba primero para devolver un error claro antes del update.
    if (!intake) {
      throw new IntakeNotFoundException(id);
    }

    return this.repository.update(id, dto);
  }
}
