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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createIntakeUseCase Caso de uso encargado de create intake use case.
   * @param findIntakesUseCase Caso de uso encargado de find intakes use case.
   * @param findIntakeByIdUseCase Caso de uso encargado de find intake by id use case.
   * @param updateIntakeUseCase Caso de uso encargado de update intake use case.
   * @param deleteIntakeUseCase Caso de uso encargado de delete intake use case.
   */
  constructor(
    private readonly createIntakeUseCase: CreateIntakeUseCase,
    private readonly findIntakesUseCase: FindIntakesUseCase,
    private readonly findIntakeByIdUseCase: FindIntakeByIdUseCase,
    private readonly updateIntakeUseCase: UpdateIntakeUseCase,
    private readonly deleteIntakeUseCase: DeleteIntakeUseCase,
  ) {}
  /**
   * Crea un toma con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateIntakeDto) {
    // Cada metodo delega una accion HTTP en su caso de uso correspondiente.
    return this.createIntakeUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de tomas que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(filters: FindIntakesDto) {
    return this.findIntakesUseCase.execute(filters);
  }
  /**
   * Obtiene un toma por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findOne(id: number) {
    return this.findIntakeByIdUseCase.execute(id);
  }
  /**
   * Actualiza un toma existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateIntakeDto) {
    return this.updateIntakeUseCase.execute(id, dto);
  }
  /**
   * Elimina un toma por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  remove(id: number) {
    return this.deleteIntakeUseCase.execute(id);
  }
}
