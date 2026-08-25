import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateIntakeDto } from '../../application/dtos/create-intake.dto';
import { FindIntakesDto } from '../../application/dtos/find-intakes.dto';
import { UpdateIntakeDto } from '../../application/dtos/update-intake.dto';
import { IntakeEntity } from '../../domain/entities/intake.entity';
import { IntakesExceptionFilter } from '../filters/intakes-exception.filter';
import { IntakesService } from '../services/intakes.service';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Permission } from '../../../../common/enums/permission.enum';
import { SystemRole } from '../../../../common/enums/system-role.enum';

@ApiTags('Intakes')
@ApiBearerAuth()
@Controller('intakes')
@UseFilters(IntakesExceptionFilter)
// Expone los endpoints HTTP y delega la logica de aplicacion al servicio.
export class IntakesController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param intakesService Servicio que coordina las operaciones de intakes service.
   */
  constructor(private readonly intakesService: IntakesService) {}
  /**
   * Crea un toma con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post()
  @Permissions(Permission.REGISTER_INTAKES)
  @ApiOperation({
    summary: 'Registrar una toma de medicamento',
    description:
      'Crea una nueva toma asociada a un paciente y a un item de receta. Puede enlazarse a un recordatorio y al usuario que la confirma.',
  })
  @ApiCreatedResponse({
    description: 'Toma registrada correctamente.',
    type: IntakeEntity,
  })
  @ApiBadRequestResponse({
    description: 'Datos invalidos o relacion inexistente.',
  })
  // Recibe el cuerpo validado por pipes globales antes de crear la toma.
  create(@Body() dto: CreateIntakeDto) {
    return this.intakesService.create(dto);
  }
  /**
   * Obtiene el listado de tomas que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({
    summary: 'Listar tomas de medicamentos',
    description:
      'Obtiene las tomas registradas con filtros por paciente, item de receta, recordatorio, usuario confirmador, estado y rango de fecha programada.',
  })
  @ApiOkResponse({
    description: 'Listado de tomas obtenido correctamente.',
  })
  // Los filtros llegan desde query params y se transforman en el DTO.
  findAll(@Query() filters: FindIntakesDto) {
    return this.intakesService.findAll(filters);
  }
  /**
   * Obtiene un toma por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({
    summary: 'Obtener una toma por ID',
  })
  @ApiOkResponse({
    description: 'Toma encontrada.',
    type: IntakeEntity,
  })
  @ApiNotFoundResponse({
    description: 'La toma no fue encontrada.',
  })
  // ParseIntPipe evita pasar identificadores no numericos a la capa de uso.
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.intakesService.findOne(id);
  }
  /**
   * Actualiza un toma existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id')
  @Permissions(Permission.REGISTER_INTAKES)
  @ApiOperation({
    summary: 'Actualizar una toma',
  })
  @ApiOkResponse({
    description: 'Toma actualizada correctamente.',
    type: IntakeEntity,
  })
  @ApiNotFoundResponse({
    description: 'La toma no fue encontrada.',
  })
  @ApiBadRequestResponse({
    description: 'Datos invalidos.',
  })
  // Aplica cambios parciales usando el mismo identificador de ruta.
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIntakeDto) {
    return this.intakesService.update(id, dto);
  }
  /**
   * Elimina un toma por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id')
  @Roles(SystemRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una toma',
  })
  @ApiNoContentResponse({
    description: 'Toma eliminada correctamente.',
  })
  @ApiNotFoundResponse({
    description: 'La toma no fue encontrada.',
  })
  // Responde 204 cuando la eliminacion se completa sin contenido adicional.
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.intakesService.remove(id);
  }
}
