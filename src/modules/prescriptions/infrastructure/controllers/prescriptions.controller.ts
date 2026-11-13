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
import { PrescriptionsService } from '../services/prescriptions.service';
import { CreatePrescriptionDto } from '../../application/dtos/create-prescription.dto';
import { UpdatePrescriptionDto } from '../../application/dtos/update-prescription.dto';
import { FindPrescriptionsQueryDto } from '../../application/dtos/find-prescriptions-query.dto';
import { PrescriptionExceptionFilter } from '../filters/prescription-exception.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Permission } from '../../../../common/enums/permission.enum';
import { SystemRole } from '../../../../common/enums/system-role.enum';

// Expone los endpoints HTTP para crear, consultar, actualizar, cancelar y eliminar recetas.
@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
@UseFilters(PrescriptionExceptionFilter)
export class PrescriptionsController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prescriptionsService Servicio que coordina las operaciones de prescriptions service.
   */
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  // Registra una receta con sus medicamentos asociados.
  /**
   * Crea un prescripcion con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post()
  @Permissions(Permission.CREATE_PRESCRIPTIONS)
  @ApiOperation({ summary: 'Crear una receta' })
  @ApiResponse({ status: 201, description: 'Receta creada correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos de receta invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(dto);
  }

  // Lista recetas aplicando paginacion y filtros opcionales.
  /**
   * Obtiene el listado de prescripcions que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({ summary: 'Listar recetas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de recetas obtenido correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  findAll(@Query() query: FindPrescriptionsQueryDto) {
    return this.prescriptionsService.findAll(query);
  }

  // Consulta el detalle de una receta por su identificador.
  /**
   * Obtiene un prescripcion por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({ summary: 'Obtener una receta por id' })
  @ApiResponse({ status: 200, description: 'Receta obtenida correctamente.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Receta no encontrada.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.findById(id);
  }

  // Actualiza los datos generales y, si se envian, reemplaza los medicamentos.
  /**
   * Actualiza un prescripcion existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id')
  @Permissions(Permission.CREATE_PRESCRIPTIONS)
  @ApiOperation({ summary: 'Actualizar una receta' })
  @ApiResponse({
    status: 200,
    description: 'Receta actualizada correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos de receta invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Receta no encontrada.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(id, dto);
  }

  // Cambia el estado de la receta para marcarla como cancelada o finalizada segun la regla actual.
  /**
   * Ejecuta la operación cancel.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id/cancel')
  @Permissions(Permission.CREATE_PRESCRIPTIONS)
  @ApiOperation({ summary: 'Cancelar una receta' })
  @ApiResponse({ status: 200, description: 'Receta cancelada correctamente.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Receta no encontrada.' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.cancel(id);
  }

  // Elimina una receta existente.
  /**
   * Elimina un prescripcion por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una receta' })
  @ApiResponse({ status: 200, description: 'Receta eliminada correctamente.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Receta no encontrada.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.delete(id);
  }
}
