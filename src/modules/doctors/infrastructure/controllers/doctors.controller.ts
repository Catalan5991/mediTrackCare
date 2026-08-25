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
  ApiOkResponse,
} from '@nestjs/swagger';

import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { CurrentUser as AuthenticatedUser } from '../../../../common/decorators/current-user.decorator';
import { SystemRole } from '../../../../common/enums/system-role.enum';
import { CreateDoctorDto } from '../../application/dtos/create-doctor.dto';
import { QueryDoctorDto } from '../../application/dtos/query-doctor.dto';
import { UpdateDoctorDto } from '../../application/dtos/update-doctor.dto';
import { DoctorExceptionFilter } from '../filters/doctor-exception.filter';
import { DoctorsService } from '../services/doctors.service';
import {
  DoctorResponseDto,
  PaginatedDoctorsResponseDto,
} from '../../application/dtos/doctor-response.dto';

@ApiTags('Doctors')
@ApiBearerAuth()
@Controller('doctors')
@UseFilters(DoctorExceptionFilter)
export class DoctorsController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param service Servicio que coordina las operaciones de service.
   */
  constructor(private readonly service: DoctorsService) {}
  /**
   * Crea un medico con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post()
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Crear un perfil de doctor' })
  @ApiResponse({ status: 201, description: 'Doctor creado correctamente.' })
  @ApiResponse({
    status: 400,
    description: 'Usuario inexistente o sin rol DOCTOR.',
  })
  @ApiResponse({ status: 409, description: 'Usuario o cédula duplicados.' })
  create(@Body() dto: CreateDoctorDto) {
    return this.service.create(dto);
  }
  /**
   * Obtiene el listado de medicos que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @Roles(SystemRole.ADMIN, SystemRole.DOCTOR)
  @ApiOperation({ summary: 'Listar doctores' })
  @ApiOkResponse({ type: PaginatedDoctorsResponseDto })
  findAll(@Query() query: QueryDoctorDto) {
    return this.service.findAll(query);
  }
  /**
   * Obtiene mine.
   * @param user Valor de user requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get('me')
  @Roles(SystemRole.DOCTOR)
  @ApiOperation({ summary: 'Obtener el perfil del doctor autenticado' })
  @ApiOkResponse({ type: DoctorResponseDto })
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findMine(user.id);
  }
  /**
   * Obtiene my patients.
   * @param user Valor de user requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Get('me/patients')
  @Roles(SystemRole.DOCTOR)
  @ApiOperation({ summary: 'Listar pacientes asignados al doctor autenticado' })
  async findMyPatients(@CurrentUser() user: AuthenticatedUser) {
    const doctor = await this.service.findMine(user.id);
    return this.service.findPatients(doctor.id);
  }
  /**
   * Obtiene patients.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id/patients')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Listar asignaciones de pacientes de un doctor' })
  findPatients(@Param('id', ParseIntPipe) id: number) {
    return this.service.findPatients(id);
  }
  /**
   * Ejecuta la operación assign patient.
   * @param id Identificador único del recurso.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post(':id/patients/:patientId')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Asignar un paciente a un doctor' })
  assignPatient(
    @Param('id', ParseIntPipe) id: number,
    @Param('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.service.assignPatient(id, patientId);
  }
  /**
   * Elimina patient.
   * @param id Identificador único del recurso.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id/patients/:patientId')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Desactivar la asignación de un paciente' })
  removePatient(
    @Param('id', ParseIntPipe) id: number,
    @Param('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.service.removePatient(id, patientId);
  }
  /**
   * Obtiene un medico por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  @Roles(SystemRole.ADMIN, SystemRole.DOCTOR)
  @ApiOperation({ summary: 'Obtener un doctor por id' })
  @ApiOkResponse({ type: DoctorResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
  /**
   * Actualiza un medico existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un doctor' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDoctorDto) {
    return this.service.update(id, dto);
  }
  /**
   * Elimina un medico por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id')
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Desactivar un doctor' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
