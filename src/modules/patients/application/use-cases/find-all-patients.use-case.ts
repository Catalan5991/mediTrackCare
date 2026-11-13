import { Inject, Injectable } from '@nestjs/common';
import { QueryPatientDto } from '../../application/dtos/query-patient.dto';
import {
  PATIENTS_REPOSITORY,
  PatientsRepository,
} from '../../domain/interfaces/patients.repository.interface';

// Lista pacientes con busqueda, paginacion y filtro opcional de estado.
@Injectable()
export class FindAllPatientsUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param patientsRepository Repositorio utilizado para persistir y consultar patients repository.
   */
  constructor(
    @Inject(PATIENTS_REPOSITORY)
    private readonly patientsRepository: PatientsRepository,
  ) {}
  /**
   * Obtiene informacion de paciente segun los criterios indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(query: QueryPatientDto) {
    // Define valores por defecto para mantener estable la paginacion de la API.
    return this.patientsRepository.findAll({
      search: query.search,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      isActive: query.isActive,
    });
  }
}
