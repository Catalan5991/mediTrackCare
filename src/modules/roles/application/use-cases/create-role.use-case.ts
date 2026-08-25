import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleAlreadyExistsException } from '../../domain/exceptions/role-already-exists.exception';
import {
  ROLES_REPOSITORY,
  RolesRepository,
} from '../../domain/interfaces/roles.repository.interface';

// Caso de uso responsable de crear roles. Centraliza la regla de negocio que
// impide nombres duplicados antes de persistir el registro.
@Injectable()
export class CreateRoleUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param rolesRepository Repositorio utilizado para persistir y consultar roles repository.
   */
  constructor(
    @Inject(ROLES_REPOSITORY)
    private readonly rolesRepository: RolesRepository,
  ) {}
  /**
   * Crea un rol aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {RoleAlreadyExistsException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(dto: CreateRoleDto) {
    // Validacion previa para devolver un error de dominio claro antes de llegar
    // a la restriccion unica de Prisma/PostgreSQL.
    const existingRole = await this.rolesRepository.findByName(dto.name);

    if (existingRole) {
      throw new RoleAlreadyExistsException(
        `El rol con nombre ${dto.name} ya existe`,
      );
    }

    return this.rolesRepository.create(dto);
  }
}
