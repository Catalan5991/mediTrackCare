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
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Permission } from '../../../../common/enums/permission.enum';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller('audit-logs')
@Permissions(Permission.VIEW_AUDIT_LOGS)
export class AuditLogsController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param service Servicio que coordina las operaciones de service.
   */
  constructor(private readonly service: AuditLogsService) {}
  /**
   * Obtiene el listado de registro de auditorias que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
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

  /**
   * Obtiene by id.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Consultar un registro de auditoría por ID.' })
  @ApiOkResponse({ type: AuditLogResponseDto })
  @ApiNotFoundResponse({ description: 'Registro de auditoría no encontrado.' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditLogResponseDto> {
    return AuditLogMapper.toResponse(await this.service.findById(id));
  }

  /**
   * Crea un registro de auditoria con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Post()
  @ApiOperation({ summary: 'Registrar un evento de auditoría.' })
  @ApiCreatedResponse({ type: AuditLogResponseDto })
  async create(@Body() dto: CreateAuditLogDto): Promise<AuditLogResponseDto> {
    return AuditLogMapper.toResponse(await this.service.create(dto));
  }
}
