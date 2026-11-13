import { Inject, Injectable } from '@nestjs/common';
import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';
import {
  ROLES_REPOSITORY,
  RolesRepository,
} from '../../domain/interfaces/roles.repository.interface';

// Caso de uso de detalle. Expresa la ausencia del rol como excepcion de dominio
// para que la capa HTTP responda 404 con un formato uniforme.
@Injectable()
export class FindRoleByIdUseCase {
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
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {RoleNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number) {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException(id);
    }

    return role;
  }
}
