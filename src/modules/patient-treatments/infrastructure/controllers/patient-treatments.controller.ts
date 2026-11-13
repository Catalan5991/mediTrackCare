import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePatientTreatmentDto, UpdatePatientTreatmentDto, RecordTreatmentIntakeDto } from '../../application/treatment.dto';
import { CreateExternalConsultationDto } from '../../application/external-consultation.dto';
import { CreateAdministrationDto, RecordAdministrationDto } from '../../application/administration.dto';
import { CreateMedicationDto } from '../../../medications/application/dtos/create-medication.dto';
import { PatientTreatmentsService } from '../patient-treatments.service';

@ApiTags('Patient treatments') @ApiBearerAuth()
@Controller('patient-treatments')
export class PatientTreatmentsController {
  constructor(private readonly service:PatientTreatmentsService){}
  @Post('administrations') @ApiOperation({summary:'Registrar sesión especial con varios componentes'})
  createAdministration(@Body() dto:CreateAdministrationDto){return this.service.createAdministration(dto);}
  @Get('administrations') listAdministrations(@Query('patientId',ParseIntPipe) patientId:number){return this.service.listAdministrations(patientId);}
  @Post('administrations/:id/intakes') recordAdministration(@Param('id',ParseIntPipe) id:number,@Body() dto:RecordAdministrationDto){return this.service.recordAdministration(id,dto);}
  @Get('custom-medications') @ApiOperation({summary:'Medicamentos privados del paciente autorizado'})
  customList(@Query('patientId',ParseIntPipe) patientId:number,@Query('search') search?:string){return this.service.customMedications(patientId,search);}
  @Post('custom-medications') @ApiOperation({summary:'Crear medicamento privado para el paciente'})
  customCreate(@Query('patientId',ParseIntPipe) patientId:number,@Body() dto:CreateMedicationDto){return this.service.createCustomMedication(patientId,dto);}
  @Post() @ApiOperation({summary:'Registrar tratamiento personal o receta externa (sin validación médica)'})
  create(@Body() dto:CreatePatientTreatmentDto){return this.service.create(dto);}
  @Post('external-consultations') @ApiOperation({summary:'Registrar consulta externa y sus N medicamentos en una transacción'})
  createConsultation(@Body() dto:CreateExternalConsultationDto){return this.service.createConsultation(dto);}
  @Get() @ApiOperation({summary:'Listar tratamientos de un paciente autorizado'})
  list(@Query('patientId',ParseIntPipe) patientId:number){return this.service.list(patientId);}
  @Get(':id') findOne(@Param('id',ParseIntPipe) id:number){return this.service.findOne(id);}
  @Patch(':id') @ApiOperation({summary:'Editar o cambiar estado de tratamiento personal'})
  update(@Param('id',ParseIntPipe) id:number,@Body() dto:UpdatePatientTreatmentDto){return this.service.update(id,dto);}
  @Get('agenda/day') @ApiOperation({summary:'Tomas programadas de seguimientos personales'})
  agenda(@Query('patientId',ParseIntPipe) patientId:number,@Query('date') date:string){return this.service.agenda(patientId,date);}
  @Post(':id/intakes') @ApiOperation({summary:'Registrar toma manual; no genera un recordatorio automático'})
  record(@Param('id',ParseIntPipe) id:number,@Body() dto:RecordTreatmentIntakeDto){return this.service.record(id,dto);}
  @Get(':id/intakes') history(@Param('id',ParseIntPipe) id:number){return this.service.history(id);}
}
