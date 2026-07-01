import {Body,Controller,Delete,Get,Param,ParseBoolPipe,ParseIntPipe,Patch,Post,Query,UseFilters} from '@nestjs/common';
import { CreateMedicationDto } from '../../application/dtos/create-medication.dto';
import { UpdateMedicationDto } from '../../application/dtos/update-medication.dto';
import { MedicationExceptionFilter } from '../filters/medication-exception.filter';
import { MedicationsService } from '../services/medications.service';

// Expone endpoints CRUD del catalogo y delega reglas a la capa de aplicacion.
@Controller('medications')
@UseFilters(MedicationExceptionFilter)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  create(@Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(createMedicationDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('isActive', new ParseBoolPipe({ optional: true }))
    isActive?: boolean,
  ) {
    return this.medicationsService.findAll(search, isActive);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ) {
    return this.medicationsService.update(id, updateMedicationDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.delete(id);
  }
}
