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

// Expone los endpoints HTTP para crear, consultar, actualizar, cancelar y eliminar recetas.
@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
@UseFilters(PrescriptionExceptionFilter)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  // Registra una receta con sus medicamentos asociados.
  @Post()
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
  @Get()
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
  @Get(':id')
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
  @Patch(':id')
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
  @Patch(':id/cancel')
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
  @Delete(':id')
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
