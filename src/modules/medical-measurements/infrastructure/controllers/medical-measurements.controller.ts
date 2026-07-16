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

import { CreateMedicalMeasurementDto } from '../../application/dtos/create-medical-measurement.dto';
import { UpdateMedicalMeasurementDto } from '../../application/dtos/update-medical-measurement.dto';
import { FindMedicalMeasurementsDto } from '../../application/dtos/find-medical-measurements.dto';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';
import { MedicalMeasurementsService } from '../services/medical-measurements.service';
import { MedicalMeasurementsExceptionFilter } from '../filters/medical-measurements-exception.filter';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Permission } from '../../../../common/enums/permission.enum';
import { SystemRole } from '../../../../common/enums/system-role.enum';

@ApiTags('Medical Measurements')
@ApiBearerAuth()
@Controller('medical-measurements')
@UseFilters(MedicalMeasurementsExceptionFilter)
// Expone los endpoints HTTP y delega la logica de aplicacion al servicio.
export class MedicalMeasurementsController {
  constructor(
    private readonly medicalMeasurementsService: MedicalMeasurementsService,
  ) {}

  @Post()
  @Permissions(Permission.REGISTER_MEASUREMENTS)
  @ApiOperation({
    summary: 'Registrar una medición médica',
    description:
      'Crea una nueva medición médica asociada a un paciente. Puede registrar glucosa, presión arterial, peso, temperatura, entre otros valores.',
  })
  @ApiCreatedResponse({
    description: 'Medición médica registrada correctamente.',
    type: MedicalMeasurementEntity,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o relación inexistente con paciente/usuario.',
  })
  // Recibe el cuerpo validado por pipes globales antes de crear la medicion.
  create(@Body() dto: CreateMedicalMeasurementDto) {
    return this.medicalMeasurementsService.create(dto);
  }

  @Get()
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({
    summary: 'Listar mediciones médicas',
    description:
      'Obtiene las mediciones médicas registradas con filtros por paciente, usuario, tipo de medición y rango de fechas.',
  })
  @ApiOkResponse({
    description: 'Listado de mediciones médicas obtenido correctamente.',
  })
  // Los filtros llegan desde query params y se transforman en el DTO.
  findAll(@Query() filters: FindMedicalMeasurementsDto) {
    return this.medicalMeasurementsService.findAll(filters);
  }

  @Get(':id')
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({
    summary: 'Obtener una medición médica por ID',
  })
  @ApiOkResponse({
    description: 'Medición médica encontrada.',
    type: MedicalMeasurementEntity,
  })
  @ApiNotFoundResponse({
    description: 'La medición médica no fue encontrada.',
  })
  // ParseIntPipe evita pasar identificadores no numericos a la capa de uso.
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicalMeasurementsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.REGISTER_MEASUREMENTS)
  @ApiOperation({
    summary: 'Actualizar una medición médica',
  })
  @ApiOkResponse({
    description: 'Medición médica actualizada correctamente.',
    type: MedicalMeasurementEntity,
  })
  @ApiNotFoundResponse({
    description: 'La medición médica no fue encontrada.',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos.',
  })
  // Aplica cambios parciales usando el mismo identificador de ruta.
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicalMeasurementDto,
  ) {
    return this.medicalMeasurementsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(SystemRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una medición médica',
  })
  @ApiNoContentResponse({
    description: 'Medición médica eliminada correctamente.',
  })
  @ApiNotFoundResponse({
    description: 'La medición médica no fue encontrada.',
  })
  // Responde 204 cuando la eliminacion se completa sin contenido adicional.
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicalMeasurementsService.remove(id);
  }
}
