import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MedicationsService } from '../services/medications.service';
import { CreateMedicationDto } from '../../application/dtos/create-medication.dto';
import { UpdateMedicationDto } from '../../application/dtos/update-medication.dto';

@ApiTags('Medications')
@ApiBearerAuth('JWT-auth')
@Controller('api/medications')
export class MedicationsController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param medicationsService Servicio que coordina las operaciones de medications service.
   */
  constructor(private readonly medicationsService: MedicationsService) {}
  /**
   * Crea un medicamento con los datos recibidos.
   * @param createMedicationDto Datos de create medication validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo fármaco en el catálogo general' })
  @ApiResponse({ status: 201, description: 'Medicamento registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Cuerpo de la petición inválido' })
  @ApiResponse({ status: 403, description: 'Prohibido - Requiere rol administrativo' })
  create(@Body() dto: CreateMedicationDto) {
    return this.medicationsService.create(dto);
  }
  /**
   * Obtiene el listado de medicamentos que cumplen los filtros indicados.
   * @param search Valor de search requerido por la operacion.
   * @param isActive Valor de is active requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @ApiOperation({ summary: 'Consultar el catálogo de medicamentos disponibles' })
  @ApiQuery({ name: 'search', required: false, description: 'Texto para filtrar por nombre' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filtro por estado activo o inactivo' })
  @ApiResponse({ status: 200, description: 'Catálogo de medicamentos recuperado' })
  findAll(@Query('search') search?: string, @Query('isActive') isActive?: boolean) {
    return this.medicationsService.findAll(search, isActive);
  }
  /**
   * Obtiene un medicamento por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Consultar un medicamento por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID numérico del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento encontrado' })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.findById(id);
  }
  /**
   * Actualiza un medicamento existente.
   * @param id Identificador único del recurso.
   * @param updateMedicationDto Datos de update medication validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar las características de un medicamento existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento actualizado' })
  @ApiResponse({ status: 403, description: 'Prohibido - Rol insuficiente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMedicationDto) {
    return this.medicationsService.update(id, dto);
  }
  /**
   * Elimina un medicamento por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar lógicamente un medicamento' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento desactivado correctamente' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.delete(id);
  }
}