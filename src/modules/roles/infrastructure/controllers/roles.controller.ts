import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { QueryRoleDto } from '../../application/dtos/query-role.dto';
import { UpdateRoleDto } from '../../application/dtos/update-role.dto';
import { RoleExceptionFilter } from '../filters/role-exception.filter';
import { RolesService } from '../services/roles.service';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Permission } from '../../../../common/enums/permission.enum';

// Controller HTTP del modulo Roles. Recibe parametros, activa validaciones y
// delega en el servicio; las reglas de negocio viven en casos de uso.
@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
//@Permissions(Permission.MANAGE_ROLES)
@UseFilters(RoleExceptionFilter)
export class RolesController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param rolesService Servicio que coordina las operaciones de roles service.
   */
  constructor(private readonly rolesService: RolesService) {}
  /**
   * Crea un rol con los datos recibidos.
   * @param createRoleDto Datos de create role validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un rol' })
  @ApiResponse({ status: 201, description: 'Rol creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos de rol invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({
    status: 409,
    description: 'El rol ya existe.',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    // POST /roles registra un nuevo rol funcional del sistema.
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Obtiene el listado de rols que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener listado de roles' })
  @ApiResponse({
    status: 200,
    description: 'Listado de roles obtenido correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  findAll(@Query() query: QueryRoleDto) {
    // GET /roles admite paginacion, busqueda por texto y filtro por estado.
    return this.rolesService.findAll(query);
  }
  
  /**
   * Obtiene un rol por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por id' })
  @ApiResponse({ status: 200, description: 'Rol obtenido correctamente.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe evita que ids no numericos lleguen al caso de uso.
    return this.rolesService.findOne(id);
  }
  /**
   * Actualiza un rol existente.
   * @param id Identificador único del recurso.
   * @param updateRoleDto Datos de update role validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos de rol invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'El rol ya existe.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    // PATCH /roles/:id permite modificar parcialmente nombre, descripcion o estado.
    return this.rolesService.update(id, updateRoleDto);
  }
  /**
   * Elimina un rol por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiResponse({ status: 200, description: 'Rol eliminado correctamente.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    // DELETE realiza desactivacion logica, no eliminacion fisica.
    return this.rolesService.remove(id);
  }
}
