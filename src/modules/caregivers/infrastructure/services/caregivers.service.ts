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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createCaregiverUseCase Caso de uso encargado de create caregiver use case.
   * @param findAllCaregiversUseCase Caso de uso encargado de find all caregivers use case.
   * @param findCaregiverByIdUseCase Caso de uso encargado de find caregiver by id use case.
   * @param updateCaregiverUseCase Caso de uso encargado de update caregiver use case.
   * @param deleteCaregiverUseCase Caso de uso encargado de delete caregiver use case.
   */
  constructor(
    private readonly createCaregiverUseCase: CreateCaregiverUseCase,
    private readonly findAllCaregiversUseCase: FindAllCaregiversUseCase,
    private readonly findCaregiverByIdUseCase: FindCaregiverByIdUseCase,
    private readonly updateCaregiverUseCase: UpdateCaregiverUseCase,
    private readonly deleteCaregiverUseCase: DeleteCaregiverUseCase,
  ) {}
  /**
   * Crea un cuidador con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateCaregiverDto) {
    return this.createCaregiverUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de cuidadors que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(query: QueryCaregiverDto) {
    return this.findAllCaregiversUseCase.execute(query);
  }
  /**
   * Obtiene un cuidador por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findOne(id: number) {
    return this.findCaregiverByIdUseCase.execute(id);
  }
  /**
   * Actualiza un cuidador existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateCaregiverDto) {
    return this.updateCaregiverUseCase.execute(id, dto);
  }
  /**
   * Elimina un cuidador por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  remove(id: number) {
    return this.deleteCaregiverUseCase.execute(id);
  }
}
