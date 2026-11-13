import {
  PatientLinkDto,
  PatientLinksResponseDto,
} from '../../application/dtos/patient-mobile-response.dto';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManagePatientLinksUseCase } from '../../application/use-cases/manage-patient-links.use-case';
import {
  RequestPatientLinkDto,
  DecidePatientLinkDto,
  LinkKind,
} from '../../application/dtos/patient-link.dto';
@ApiTags('Patient links')
@ApiBearerAuth()
@Controller('patient-links')
export class PatientLinksController {
  constructor(private readonly links: ManagePatientLinksUseCase) {}
  @Post()
  @ApiCreatedResponse({ type: PatientLinkDto })
  @ApiOperation({
    summary:
      'Solicitar vinculo; no otorga acceso hasta autorizacion del paciente',
  })
  request(@Body() dto: RequestPatientLinkDto) {
    return this.links.request(dto);
  }
  @Get()
  @ApiOkResponse({ type: PatientLinksResponseDto })
  @ApiOperation({
    summary: 'Consultar mis vinculos y solicitudes (hasta 100 de cada tipo)',
  })
  list() {
    return this.links.list();
  }
  @Patch(':patientId/:kind/:userId')
  @ApiOkResponse({ type: PatientLinkDto })
  @ApiOperation({
    summary:
      'Aceptar, rechazar, revocar o ajustar permisos de un vinculo; kind CAREGIVER o DOCTOR',
  })
  decide(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('kind', new ParseEnumPipe(LinkKind)) kind: LinkKind,
    @Body() dto: DecidePatientLinkDto,
  ) {
    return this.links.decide(patientId, userId, kind, dto);
  }
}
