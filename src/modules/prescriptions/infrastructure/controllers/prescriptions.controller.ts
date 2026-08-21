import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PrescriptionsService } from '../services/prescriptions.service';
import { CreatePrescriptionDto } from '../../application/dtos/create-prescription.dto';
import { UpdatePrescriptionDto } from '../../application/dtos/update-prescription.dto';
import { FindPrescriptionsQueryDto } from '../../application/dtos/find-prescriptions-query.dto';

@ApiTags('Prescriptions')
@ApiBearerAuth('JWT-auth')
@Controller('api/prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva receta médica con medicamentos asociados' })
  @ApiResponse({ status: 201, description: 'Receta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Cuerpo de la petición inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado - Token JWT no válido o ausente' })
  create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar recetas médicas registradas' })
  @ApiResponse({ status: 200, description: 'Lista de recetas médicas recuperada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Query() query: FindPrescriptionsQueryDto) {
    return this.prescriptionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar detalle de una receta médica por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador numérico de la receta' })
  @ApiResponse({ status: 200, description: 'Receta médica encontrada' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar las instrucciones o estado de una receta' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador de la receta' })
  @ApiResponse({ status: 200, description: 'Receta actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una receta médica del sistema' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador de la receta' })
  @ApiResponse({ status: 200, description: 'Receta eliminada correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.delete(id);
  }
}