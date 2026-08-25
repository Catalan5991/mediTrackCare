import { Inject, Injectable } from '@nestjs/common';
import { QueryRoleDto } from '../dtos/query-role.dto';
import {
  ROLES_REPOSITORY,
  RolesRepository,
} from '../../domain/interfaces/roles.repository.interface';

// Caso de uso de consulta para listar roles. Normaliza valores de paginacion y
// delega al repositorio la traduccion a consulta de base de datos.
@Injectable()
export class FindAllRolesUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param rolesRepository Repositorio utilizado para persistir y consultar roles repository.
   */
  constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: RolesRepository,
  ) {}
  /**
   * Obtiene informacion de rol segun los criterios indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  execute(query: QueryRoleDto) {
    // Mantiene una respuesta estable aunque el cliente omita page o limit.
    return this.rolesRepository.findAll({
      search: query.search,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      isActive: query.isActive,
    });
  }
}
