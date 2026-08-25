import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { QueryRoleDto } from '../../application/dtos/query-role.dto';
import { UpdateRoleDto } from '../../application/dtos/update-role.dto';
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from '../../application/use-cases/delete-role.use-case';
import { FindAllRolesUseCase } from '../../application/use-cases/find-all-roles.use-case';
import { FindRoleByIdUseCase } from '../../application/use-cases/find-role-by-id.use-case';
import { UpdateRoleUseCase } from '../../application/use-cases/update-role.use-case';

// Servicio usado por el controller como fachada de infraestructura. No contiene
// reglas de negocio: cada metodo delega en un caso de uso especifico para que la
// orquestacion del modulo permanezca en la capa application.
@Injectable()
export class RolesService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createRoleUseCase Caso de uso encargado de create role use case.
   * @param findAllRolesUseCase Caso de uso encargado de find all roles use case.
   * @param findRoleByIdUseCase Caso de uso encargado de find role by id use case.
   * @param updateRoleUseCase Caso de uso encargado de update role use case.
   * @param deleteRoleUseCase Caso de uso encargado de delete role use case.
   */
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly findAllRolesUseCase: FindAllRolesUseCase,
    private readonly findRoleByIdUseCase: FindRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}
  /**
   * Crea un rol con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateRoleDto) {
    return this.createRoleUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de rols que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(query: QueryRoleDto) {
    return this.findAllRolesUseCase.execute(query);
  }
  /**
   * Obtiene un rol por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findOne(id: number) {
    return this.findRoleByIdUseCase.execute(id);
  }
  /**
   * Actualiza un rol existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateRoleDto) {
    return this.updateRoleUseCase.execute(id, dto);
  }
  /**
   * Elimina un rol por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  remove(id: number) {
    return this.deleteRoleUseCase.execute(id);
  }
}
