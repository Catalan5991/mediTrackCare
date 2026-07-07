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
  constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: RolesRepository,
  ) {}

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
