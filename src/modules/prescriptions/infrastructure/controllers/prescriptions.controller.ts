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

// Expone los endpoints HTTP para crear, consultar, actualizar, cancelar y eliminar recetas.
@Controller('prescriptions')
@UseFilters(PrescriptionExceptionFilter)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  // Registra una receta con sus medicamentos asociados.
  @Post()
  create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(dto);
  }

  // Lista recetas aplicando paginacion y filtros opcionales.
  @Get()
  findAll(@Query() query: FindPrescriptionsQueryDto) {
    return this.prescriptionsService.findAll(query);
  }

  // Consulta el detalle de una receta por su identificador.
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.findById(id);
  }

  // Actualiza los datos generales y, si se envian, reemplaza los medicamentos.
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(id, dto);
  }

  // Cambia el estado de la receta para marcarla como cancelada o finalizada segun la regla actual.
  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.cancel(id);
  }

  // Elimina una receta existente.
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.delete(id);
  }
}
