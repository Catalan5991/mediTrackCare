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
import { CreateCaregiverDto } from '../../application/dtos/create-caregiver.dto';
import { QueryCaregiverDto } from '../../application/dtos/query-caregiver.dto';
import { UpdateCaregiverDto } from '../../application/dtos/update-caregiver.dto';
import { CaregiverExceptionFilter } from '../filters/caregiver-exception.filter';
import { CaregiversService } from '../services/caregivers.service';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Permission } from '../../../../common/enums/permission.enum';
import { SystemRole } from '../../../../common/enums/system-role.enum';

// Controller HTTP del modulo Caregivers. Se limita a recibir parametros,
// activar validaciones/filters y delegar en el servicio; las reglas de negocio
// viven en casos de uso para mantener esta capa delgada.
@ApiTags('Caregivers')
@ApiBearerAuth()
@Controller('caregivers')
@UseFilters(CaregiverExceptionFilter)
export class CaregiversController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param caregiversService Servicio que coordina las operaciones de caregivers service.
   */
  constructor(private readonly caregiversService: CaregiversService) {}
  /**
   * Crea un cuidador con los datos recibidos.
   * @param createCaregiverDto Datos de create caregiver validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post()
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Crear un cuidador' })
  @ApiResponse({ status: 201, description: 'Cuidador creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos de cuidador invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({
    status: 409,
    description: 'El cuidador ya existe para el paciente indicado.',
  })
  create(@Body() createCaregiverDto: CreateCaregiverDto) {
    // POST /caregivers registra una nueva relacion usuario-paciente.
    return this.caregiversService.create(createCaregiverDto);
  }
  /**
   * Obtiene el listado de cuidadors que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({ summary: 'Obtener listado de cuidadores' })
  @ApiResponse({
    status: 200,
    description: 'Listado de cuidadores obtenido correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  findAll(@Query() query: QueryCaregiverDto) {
    // GET /caregivers admite paginacion y filtros por usuario, paciente,
    // cuidador principal, estado activo y texto de relacion.
    return this.caregiversService.findAll(query);
  }
  /**
   * Obtiene un cuidador por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({ summary: 'Obtener un cuidador por id' })
  @ApiResponse({ status: 200, description: 'Cuidador obtenido correctamente.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Cuidador no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe evita que ids no numericos lleguen al caso de uso.
    return this.caregiversService.findOne(id);
  }
  /**
   * Actualiza un cuidador existente.
   * @param id Identificador único del recurso.
   * @param updateCaregiverDto Datos de update caregiver validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un cuidador' })
  @ApiResponse({
    status: 200,
    description: 'Cuidador actualizado correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos de cuidador invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Cuidador no encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'El cuidador ya existe para el paciente indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCaregiverDto: UpdateCaregiverDto,
  ) {
    // PATCH /caregivers/:id permite actualizar parcialmente la relacion.
    return this.caregiversService.update(id, updateCaregiverDto);
  }
  /**
   * Elimina un cuidador por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un cuidador' })
  @ApiResponse({
    status: 200,
    description: 'Cuidador eliminado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Cuidador no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    // DELETE realiza desactivacion logica, no eliminacion fisica.
    return this.caregiversService.remove(id);
  }
}
