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

// Expone endpoints CRUD de pacientes y mantiene reglas en la capa de aplicacion.
@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseFilters(PatientExceptionFilter)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
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

  @Get()
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

  @Get(':id')
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

  @Patch(':id')
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

  @Delete(':id')
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
