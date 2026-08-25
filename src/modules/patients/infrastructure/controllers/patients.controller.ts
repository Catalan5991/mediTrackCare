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
import { CreatePatientDto } from '../../application/dtos/create-patient.dto';
import { QueryPatientDto } from '../../application/dtos/query-patient.dto';
import { UpdatePatientDto } from '../../application/dtos/update-patient.dto';
import { PatientExceptionFilter } from '../filters/patient-exception.filter';
import { PatientsService } from '../services/patients.service';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Permission } from '../../../../common/enums/permission.enum';
import { SystemRole } from '../../../../common/enums/system-role.enum';

// Expone endpoints CRUD de pacientes y mantiene reglas en la capa de aplicacion.
@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseFilters(PatientExceptionFilter)
export class PatientsController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param patientsService Servicio que coordina las operaciones de patients service.
   */
  constructor(private readonly patientsService: PatientsService) {}
  /**
   * Crea un paciente con los datos recibidos.
   * @param createPatientDto Datos de create patient validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post()
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Crear un paciente' })
  @ApiResponse({ status: 201, description: 'Paciente creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos de paciente invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({
    status: 409,
    description: 'El paciente ya existe para el usuario indicado.',
  })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }
  /**
   * Obtiene el listado de pacientes que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({ summary: 'Obtener listado de pacientes' })
  @ApiResponse({
    status: 200,
    description: 'Listado de pacientes obtenido correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  findAll(@Query() query: QueryPatientDto) {
    return this.patientsService.findAll(query);
  }
  /**
   * Obtiene un paciente por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({ summary: 'Obtener un paciente por id' })
  @ApiResponse({ status: 200, description: 'Paciente obtenido correctamente.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }
  /**
   * Actualiza un paciente existente.
   * @param id Identificador único del recurso.
   * @param updatePatientDto Datos de update patient validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un paciente' })
  @ApiResponse({
    status: 200,
    description: 'Paciente actualizado correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos de paciente invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }
  /**
   * Elimina un paciente por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un paciente' })
  @ApiResponse({
    status: 200,
    description: 'Paciente eliminado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
