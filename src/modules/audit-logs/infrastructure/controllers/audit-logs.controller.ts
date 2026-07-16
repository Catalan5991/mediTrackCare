import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuditLogResponseDto,
  PaginatedAuditLogsResponseDto,
} from '../../application/dtos/audit-log-response.dto';
import { CreateAuditLogDto } from '../../application/dtos/create-audit-log.dto';
import { FindAuditLogsDto } from '../../application/dtos/find-audit-logs.dto';
import { AuditLogMapper } from '../mappers/audit-log.mapper';
import { AuditLogsService } from '../services/audit-logs.service';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly service: AuditLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un evento de auditoría.' })
  @ApiCreatedResponse({ type: AuditLogResponseDto })
  async create(@Body() dto: CreateAuditLogDto): Promise<AuditLogResponseDto> {
    return AuditLogMapper.toResponse(await this.service.create(dto));
  }

  @Get()
  @ApiOperation({
    summary: 'Consultar registros de auditoría con filtros y paginación.',
  })
  @ApiOkResponse({ type: PaginatedAuditLogsResponseDto })
  async findAll(
    @Query() query: FindAuditLogsDto,
  ): Promise<PaginatedAuditLogsResponseDto> {
    const result = await this.service.findAll(query);
    return { ...result, data: result.data.map(AuditLogMapper.toResponse) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un registro de auditoría por ID.' })
  @ApiOkResponse({ type: AuditLogResponseDto })
  @ApiNotFoundResponse({ description: 'Registro de auditoría no encontrado.' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditLogResponseDto> {
    return AuditLogMapper.toResponse(await this.service.findById(id));
  }
}
