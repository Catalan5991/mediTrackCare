import { Inject, Injectable } from '@nestjs/common';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { RoleAlreadyExistsException } from '../../domain/exceptions/role-already-exists.exception';
import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';
import {
  ROLES_REPOSITORY,
  RolesRepository,
} from '../../domain/interfaces/roles.repository.interface';

// Caso de uso para actualizaciones parciales. Verifica existencia y evita que
// un cambio de nombre choque con otro rol ya registrado.
@Injectable()
export class UpdateRoleUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param rolesRepository Repositorio utilizado para persistir y consultar roles repository.
   */
  constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: RolesRepository,
  ) {}
  /**
   * Actualiza un rol aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {RoleNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   * @throws {RoleAlreadyExistsException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number, dto: UpdateRoleDto) {
    // Se consulta primero para distinguir entre "no existe" y errores de update.
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new RoleNotFoundException(id);
    }

    if (dto.name && dto.name !== role.name) {
      // Si cambia el nombre, se valida contra otros registros para conservar la
      // unicidad funcional del rol.
      const existingRole = await this.rolesRepository.findByNameExceptId(
        dto.name,
        id,
      );

      if (existingRole) {
        throw new RoleAlreadyExistsException(
          `El rol con nombre ${dto.name} ya existe`,
        );
      }
    }

    return this.rolesRepository.update(id, dto);
  }
}
