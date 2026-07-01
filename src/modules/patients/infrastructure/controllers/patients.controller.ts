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
import { CreatePatientDto } from '../../application/dtos/create-patient.dto';
import { QueryPatientDto } from '../../application/dtos/query-patient.dto';
import { UpdatePatientDto } from '../../application/dtos/update-patient.dto';
import { PatientExceptionFilter } from '../filters/patient-exception.filter';
import { PatientsService } from '../services/patients.service';

// Expone endpoints CRUD de pacientes y mantiene reglas en la capa de aplicacion.
@Controller('patients')
@UseFilters(PatientExceptionFilter)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll(@Query() query: QueryPatientDto) {
    return this.patientsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
