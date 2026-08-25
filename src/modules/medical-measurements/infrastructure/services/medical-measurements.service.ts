import { Injectable } from '@nestjs/common';

import { CreateMedicalMeasurementDto } from '../../application/dtos/create-medical-measurement.dto';
import { UpdateMedicalMeasurementDto } from '../../application/dtos/update-medical-measurement.dto';
import { FindMedicalMeasurementsDto } from '../../application/dtos/find-medical-measurements.dto';
import { CreateMedicalMeasurementUseCase } from '../../application/use-cases/create-medical-measurement.use-case';
import { FindMedicalMeasurementsUseCase } from '../../application/use-cases/find-medical-measurements.use-case';
import { FindMedicalMeasurementByIdUseCase } from '../../application/use-cases/find-medical-measurement-by-id.use-case';
import { UpdateMedicalMeasurementUseCase } from '../../application/use-cases/update-medical-measurement.use-case';
import { DeleteMedicalMeasurementUseCase } from '../../application/use-cases/delete-medical-measurement.use-case';

@Injectable()
// Fachada de infraestructura que mantiene el controller desacoplado de los casos de uso.
export class MedicalMeasurementsService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createMedicalMeasurementUseCase Caso de uso encargado de create medical measurement use case.
   * @param findMedicalMeasurementsUseCase Caso de uso encargado de find medical measurements use case.
   * @param findMedicalMeasurementByIdUseCase Caso de uso encargado de find medical measurement by id use case.
   * @param updateMedicalMeasurementUseCase Caso de uso encargado de update medical measurement use case.
   * @param deleteMedicalMeasurementUseCase Caso de uso encargado de delete medical measurement use case.
   */
  constructor(
    private readonly createMedicalMeasurementUseCase: CreateMedicalMeasurementUseCase,
    private readonly findMedicalMeasurementsUseCase: FindMedicalMeasurementsUseCase,
    private readonly findMedicalMeasurementByIdUseCase: FindMedicalMeasurementByIdUseCase,
    private readonly updateMedicalMeasurementUseCase: UpdateMedicalMeasurementUseCase,
    private readonly deleteMedicalMeasurementUseCase: DeleteMedicalMeasurementUseCase,
  ) {}
  /**
   * Crea un medicion medica con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateMedicalMeasurementDto) {
    // Cada metodo delega una accion HTTP en su caso de uso correspondiente.
    return this.createMedicalMeasurementUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de medicion medicas que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(filters: FindMedicalMeasurementsDto) {
    return this.findMedicalMeasurementsUseCase.execute(filters);
  }
  /**
   * Obtiene un medicion medica por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findOne(id: number) {
    return this.findMedicalMeasurementByIdUseCase.execute(id);
  }
  /**
   * Actualiza un medicion medica existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateMedicalMeasurementDto) {
    return this.updateMedicalMeasurementUseCase.execute(id, dto);
  }
  /**
   * Elimina un medicion medica por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  remove(id: number) {
    return this.deleteMedicalMeasurementUseCase.execute(id);
  }
}
