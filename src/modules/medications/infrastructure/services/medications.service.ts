import { Injectable } from '@nestjs/common';
import { CreateMedicationDto } from '../../application/dtos/create-medication.dto';
import { UpdateMedicationDto } from '../../application/dtos/update-medication.dto';
import { CreateMedicationUseCase } from '../../application/use-cases/create-medication.use-case';
import { FindAllMedicationsUseCase } from '../../application/use-cases/find-all-medications.use-case';
import { FindMedicationByIdUseCase } from '../../application/use-cases/find-medication-by-id.use-case';
import { UpdateMedicationUseCase } from '../../application/use-cases/update-medication.use-case';
import { DeleteMedicationUseCase } from '../../application/use-cases/delete-medication.use-case';

// Fachada de infraestructura que expone operaciones del catalogo a controladores.
@Injectable()
export class MedicationsService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createMedicationUseCase Caso de uso encargado de create medication use case.
   * @param findAllMedicationsUseCase Caso de uso encargado de find all medications use case.
   * @param findMedicationByIdUseCase Caso de uso encargado de find medication by id use case.
   * @param updateMedicationUseCase Caso de uso encargado de update medication use case.
   * @param deleteMedicationUseCase Caso de uso encargado de delete medication use case.
   */
  constructor(
    private readonly createMedicationUseCase: CreateMedicationUseCase,
    private readonly findAllMedicationsUseCase: FindAllMedicationsUseCase,
    private readonly findMedicationByIdUseCase: FindMedicationByIdUseCase,
    private readonly updateMedicationUseCase: UpdateMedicationUseCase,
    private readonly deleteMedicationUseCase: DeleteMedicationUseCase,
  ) {}
  /**
   * Crea un medicamento con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateMedicationDto) {
    return this.createMedicationUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de medicamentos que cumplen los filtros indicados.
   * @param search Valor de search requerido por la operacion.
   * @param isActive Valor de is active requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(search?: string, isActive?: boolean) {
    return this.findAllMedicationsUseCase.execute({
      search,
      isActive,
    });
  }
  /**
   * Obtiene un medicamento por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number) {
    return this.findMedicationByIdUseCase.execute(id);
  }
  /**
   * Actualiza un medicamento existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateMedicationDto) {
    return this.updateMedicationUseCase.execute(id, dto);
  }
  /**
   * Elimina un medicamento por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  delete(id: number) {
    return this.deleteMedicationUseCase.execute(id);
  }
}
