import { Inject, Injectable } from '@nestjs/common';
import { CreateIntakeDto } from '../dtos/create-intake.dto';
import { IntakeEntity } from '../../domain/entities/intake.entity';
import {
  INTAKES_REPOSITORY,
  IntakesRepository,
} from '../../domain/interfaces/intakes.repository.interface';

@Injectable()
// Caso de uso encargado de delegar el registro de tomas al repositorio.
export class CreateIntakeUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param repository Repositorio utilizado para persistir y consultar repository.
   */
  constructor(
    @Inject(INTAKES_REPOSITORY)
    private readonly repository: IntakesRepository,
  ) {}
  /**
   * Crea un toma aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(dto: CreateIntakeDto): Promise<IntakeEntity> {
    // La persistencia valida relaciones y transforma los campos de fecha.
    return this.repository.create(dto);
  }
}
