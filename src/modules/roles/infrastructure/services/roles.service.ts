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
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly findAllRolesUseCase: FindAllRolesUseCase,
    private readonly findRoleByIdUseCase: FindRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  create(dto: CreateRoleDto) {
    return this.createRoleUseCase.execute(dto);
  }

  findAll(query: QueryRoleDto) {
    return this.findAllRolesUseCase.execute(query);
  }

  findOne(id: number) {
    return this.findRoleByIdUseCase.execute(id);
  }

  update(id: number, dto: UpdateRoleDto) {
    return this.updateRoleUseCase.execute(id, dto);
  }

  remove(id: number) {
    return this.deleteRoleUseCase.execute(id);
  }
}
