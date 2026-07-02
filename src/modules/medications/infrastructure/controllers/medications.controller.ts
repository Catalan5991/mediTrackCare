import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { CreateMedicationDto } from '../../application/dtos/create-medication.dto';
import { UpdateMedicationDto } from '../../application/dtos/update-medication.dto';
import { MedicationExceptionFilter } from '../filters/medication-exception.filter';
import { MedicationsService } from '../services/medications.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Expone endpoints CRUD del catalogo y delega reglas a la capa de aplicacion.
@ApiTags('Medications')
@ApiBearerAuth()
@Controller('medications')
@UseFilters(MedicationExceptionFilter)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un medicamento' })
  @ApiResponse({
    status: 201,
    description: 'Medicamento creado correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos de medicamento invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  create(@Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(createMedicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar medicamentos' })
  @ApiResponse({
    status: 200,
    description: 'Listado de medicamentos obtenido correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  findAll(
    @Query('search') search?: string,
    @Query('isActive', new ParseBoolPipe({ optional: true }))
    isActive?: boolean,
  ) {
    return this.medicationsService.findAll(search, isActive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un medicamento por id' })
  @ApiResponse({
    status: 200,
    description: 'Medicamento obtenido correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un medicamento' })
  @ApiResponse({
    status: 200,
    description: 'Medicamento actualizado correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos de medicamento invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ) {
    return this.medicationsService.update(id, updateMedicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un medicamento' })
  @ApiResponse({
    status: 200,
    description: 'Medicamento eliminado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.delete(id);
  }
}
