import { Inject, Injectable } from '@nestjs/common';
import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';
import {
  ROLES_REPOSITORY,
  RolesRepository,
} from '../../domain/interfaces/roles.repository.interface';

// Caso de uso de eliminacion logica. Desactiva el rol en lugar de borrarlo para
// conservar historial y no afectar relaciones existentes con usuarios.
@Injectable()
export class DeleteRoleUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param rolesRepository Repositorio utilizado para persistir y consultar roles repository.
   */
  constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: RolesRepository,
  ) {}
  /**
   * Elimina un rol aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {RoleNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number) {
    // Confirma existencia para responder 404 cuando el id no pertenece a ningun
    // rol registrado.
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException(id);
    }

    return this.rolesRepository.softDelete(id);
  }
}
