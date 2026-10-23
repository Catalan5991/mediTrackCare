import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigureTreatmentPreferencesUseCase } from '../../application/use-cases/configure-treatment-preferences.use-case';
import { TreatmentPreferencesDto } from '../../application/dtos/treatment-preferences.dto';
@ApiTags('Reminders')
@ApiBearerAuth()
@Controller('prescriptions/items')
export class TreatmentPreferencesController {
  constructor(private readonly useCase: ConfigureTreatmentPreferencesUseCase) {}
  @Patch(':id/reminder-preferences')
  @ApiOperation({
    summary: 'Guardar preferencias y confirmar tratamiento en una transaccion',
    description:
      'No cambia dosis ni frecuencia ni horarios prescritos. Requiere propiedad del paciente o permiso canManageReminders. confirmTreatment registra quien recibio las indicaciones.',
  })
  configure(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TreatmentPreferencesDto,
  ) {
    return this.useCase.execute(id, dto);
  }
}
