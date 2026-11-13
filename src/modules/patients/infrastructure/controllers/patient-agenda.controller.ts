import {
  PatientAgendaResponseDto,
  PatientMedicationsResponseDto,
} from '../../application/dtos/patient-mobile-response.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPatientAgendaUseCase } from '../../application/use-cases/get-patient-agenda.use-case';
import {
  PatientAgendaDto,
  PatientActivityDto,
  PatientMedicationsDto,
} from '../../application/dtos/patient-agenda.dto';
@ApiTags('Patient agenda')
@ApiBearerAuth()
@Controller('patients/:patientId')
export class PatientAgendaController {
  constructor(private readonly useCase: GetPatientAgendaUseCase) {}
  @Get('activity')
  @ApiOperation({
    summary:
      'Historial paginado de actividad del paciente autorizado, sin detalles internos de auditoria',
  })
  activity(
    @Param('patientId', ParseIntPipe) id: number,
    @Query() query: PatientActivityDto,
  ) {
    return this.useCase.activity(id, query);
  }
  @Get('agenda')
  @ApiOkResponse({ type: PatientAgendaResponseDto })
  @ApiOperation({
    summary: 'Agenda diaria, semanal o mensual en zona horaria del paciente',
    description:
      'Consulta sin escrituras. id=null indica ocurrencia calculada: registrar por POST /intakes con patientId, prescriptionItemId y scheduledAt. PENDIENTE/RETRASADA no equivalen a OMITIDA. summary y dailySummary separan confirmaciones, omisiones explicitas y pendientes.',
  })
  agenda(
    @Param('patientId', ParseIntPipe) id: number,
    @Query() query: PatientAgendaDto,
  ) {
    return this.useCase.agenda(id, query);
  }
  @Get('medications')
  @ApiOkResponse({ type: PatientMedicationsResponseDto })
  @ApiOperation({
    summary:
      'Medicamentos prescritos del paciente, historial, vigencia, horarios, preferencias y proxima toma calculable',
  })
  medications(
    @Param('patientId', ParseIntPipe) id: number,
    @Query() query: PatientMedicationsDto,
  ) {
    return this.useCase.medications(id, query);
  }
}
