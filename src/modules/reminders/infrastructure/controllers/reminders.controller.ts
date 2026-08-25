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

import { CreateReminderDto } from '../../application/dtos/create-reminder.dto';
import { FindRemindersDto } from '../../application/dtos/find-reminders.dto';
import { UpdateReminderDto } from '../../application/dtos/update-reminder.dto';
import { ReminderEntity } from '../../domain/entities/reminder.entity';
import { RemindersExceptionFilter } from '../filters/reminders-exception.filter';
import { RemindersService } from '../services/reminders.service';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Permission } from '../../../../common/enums/permission.enum';
import { SystemRole } from '../../../../common/enums/system-role.enum';

@ApiTags('Reminders')
@ApiBearerAuth()
@Controller('reminders')
@UseFilters(RemindersExceptionFilter)
// Expone los endpoints HTTP y delega la logica de aplicacion al servicio.
export class RemindersController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param remindersService Servicio que coordina las operaciones de reminders service.
   */
  constructor(private readonly remindersService: RemindersService) {}
  /**
   * Crea un recordatorio con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post()
  @Roles(SystemRole.ADMIN, SystemRole.CAREGIVER, SystemRole.PATIENT)
  @ApiOperation({
    summary: 'Registrar un recordatorio',
    description:
      'Crea un nuevo recordatorio asociado a un paciente y a un item de receta.',
  })
  @ApiCreatedResponse({
    description: 'Recordatorio registrado correctamente.',
    type: ReminderEntity,
  })
  @ApiBadRequestResponse({
    description: 'Datos invalidos o relacion inexistente.',
  })
  // Recibe el cuerpo validado por pipes globales antes de crear el recordatorio.
  create(@Body() dto: CreateReminderDto) {
    return this.remindersService.create(dto);
  }
  /**
   * Obtiene el listado de recordatorios que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({
    summary: 'Listar recordatorios',
    description:
      'Obtiene los recordatorios registrados con filtros por paciente, item de receta, hora programada y estado activo.',
  })
  @ApiOkResponse({
    description: 'Listado de recordatorios obtenido correctamente.',
  })
  // Los filtros llegan desde query params y se transforman en el DTO.
  findAll(@Query() filters: FindRemindersDto) {
    return this.remindersService.findAll(filters);
  }
  /**
   * Obtiene un recordatorio por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({
    summary: 'Obtener un recordatorio por ID',
  })
  @ApiOkResponse({
    description: 'Recordatorio encontrado.',
    type: ReminderEntity,
  })
  @ApiNotFoundResponse({
    description: 'El recordatorio no fue encontrado.',
  })
  // ParseIntPipe evita pasar identificadores no numericos a la capa de uso.
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.remindersService.findOne(id);
  }
  /**
   * Actualiza un recordatorio existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id')
  @Roles(SystemRole.ADMIN, SystemRole.CAREGIVER, SystemRole.PATIENT)
  @ApiOperation({
    summary: 'Actualizar un recordatorio',
  })
  @ApiOkResponse({
    description: 'Recordatorio actualizado correctamente.',
    type: ReminderEntity,
  })
  @ApiNotFoundResponse({
    description: 'El recordatorio no fue encontrado.',
  })
  @ApiBadRequestResponse({
    description: 'Datos invalidos.',
  })
  // Aplica cambios parciales usando el mismo identificador de ruta.
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReminderDto,
  ) {
    return this.remindersService.update(id, dto);
  }
  /**
   * Elimina un recordatorio por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id')
  @Roles(SystemRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un recordatorio',
  })
  @ApiNoContentResponse({
    description: 'Recordatorio eliminado correctamente.',
  })
  @ApiNotFoundResponse({
    description: 'El recordatorio no fue encontrado.',
  })
  // Responde 204 cuando la eliminacion se completa sin contenido adicional.
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.remindersService.remove(id);
  }
}
