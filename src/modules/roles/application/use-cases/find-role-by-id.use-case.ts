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
  constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: RolesRepository,
  ) {}

  async execute(id: number) {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException(id);
    }

    return role;
  }
}
