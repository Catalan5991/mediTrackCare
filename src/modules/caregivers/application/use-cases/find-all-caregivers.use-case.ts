import { Inject, Injectable } from '@nestjs/common';
import { QueryCaregiverDto } from '../dtos/query-caregiver.dto';
import {
  CAREGIVERS_REPOSITORY,
  CaregiversRepository,
} from '../../domain/interfaces/caregivers.repository.interface';

// Caso de uso de consulta para listar cuidadores. Normaliza valores por defecto
// de paginacion y delega al repositorio la construccion de la consulta real.
@Injectable()
export class FindAllCaregiversUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param caregiversRepository Repositorio utilizado para persistir y consultar caregivers repository.
   */
  constructor(
    @Inject(CAREGIVERS_REPOSITORY)
    private readonly caregiversRepository: CaregiversRepository,
  ) {}
  /**
   * Obtiene informacion de cuidador segun los criterios indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(query: QueryCaregiverDto) {
    // Mantiene una respuesta estable aunque el cliente omita page o limit.
    return this.caregiversRepository.findAll({
      search: query.search,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      userId: query.userId,
      patientId: query.patientId,
      isPrimary: query.isPrimary,
      isActive: query.isActive,
    });
  }
}
