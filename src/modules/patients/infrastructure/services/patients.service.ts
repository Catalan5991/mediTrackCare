import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from '../../application/dtos/create-patient.dto';
import { QueryPatientDto } from '../../application/dtos/query-patient.dto';
import { UpdatePatientDto } from '../../application/dtos/update-patient.dto';
import { CreatePatientUseCase } from '../../application/use-cases/create-patient.use-case';
import { DeletePatientUseCase } from '../../application/use-cases/delete-patient.use-case';
import { FindAllPatientsUseCase } from '../../application/use-cases/find-all-patients.use-case';
import { FindPatientByIdUseCase } from '../../application/use-cases/find-patient-by-id.use-case';
import { UpdatePatientUseCase } from '../../application/use-cases/update-patient.use-case';

// Fachada de infraestructura que delega operaciones HTTP a casos de uso.
@Injectable()
export class PatientsService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createPatientUseCase Caso de uso encargado de create patient use case.
   * @param findAllPatientsUseCase Caso de uso encargado de find all patients use case.
   * @param findPatientByIdUseCase Caso de uso encargado de find patient by id use case.
   * @param updatePatientUseCase Caso de uso encargado de update patient use case.
   * @param deletePatientUseCase Caso de uso encargado de delete patient use case.
   */
  constructor(
    private readonly createPatientUseCase: CreatePatientUseCase,
    private readonly findAllPatientsUseCase: FindAllPatientsUseCase,
    private readonly findPatientByIdUseCase: FindPatientByIdUseCase,
    private readonly updatePatientUseCase: UpdatePatientUseCase,
    private readonly deletePatientUseCase: DeletePatientUseCase,
  ) {}
  /**
   * Crea un paciente con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreatePatientDto) {
    return this.createPatientUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de pacientes que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(query: QueryPatientDto) {
    return this.findAllPatientsUseCase.execute(query);
  }
  /**
   * Obtiene un paciente por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findOne(id: number) {
    return this.findPatientByIdUseCase.execute(id);
  }
  /**
   * Actualiza un paciente existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdatePatientDto) {
    return this.updatePatientUseCase.execute(id, dto);
  }
  /**
   * Elimina un paciente por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  remove(id: number) {
    return this.deletePatientUseCase.execute(id);
  }
}
