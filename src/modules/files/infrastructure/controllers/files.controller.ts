import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFileDto } from '../../application/dtos/create-file.dto';
import {
  FileResponseDto,
  PaginatedFilesResponseDto,
} from '../../application/dtos/file-response.dto';
import { QueryFilesDto } from '../../application/dtos/query-files.dto';
import { UpdateFileDto } from '../../application/dtos/update-file.dto';
import { FileExceptionFilter } from '../filters/file-exception.filter';
import { FileMapper } from '../mappers/file.mapper';
import { FilesService } from '../services/files.service';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Permission } from '../../../../common/enums/permission.enum';
import { SystemRole } from '../../../../common/enums/system-role.enum';

@ApiTags('Files')
@Controller('files')
@UseFilters(FileExceptionFilter)
export class FilesController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param service Servicio que coordina las operaciones de service.
   */
  constructor(private readonly service: FilesService) {}
  /**
   * Obtiene el listado de archivos que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Get()
  // La consulta usa el permiso clinico compartido por los roles que pueden ver
  // pacientes bajo su alcance; los filtros determinan el conjunto solicitado.
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({ summary: 'Listar archivos con filtros y paginacion.' })
  @ApiOkResponse({ type: PaginatedFilesResponseDto })
  async findAll(
    @Query() query: QueryFilesDto,
  ): Promise<PaginatedFilesResponseDto> {
    const result = await this.service.findAll(query);
    return {
      ...result,
      data: result.data.map((file) => FileMapper.toResponse(file)),
    };
  }

  /**
   * Obtiene by id.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Get(':id')
  // Mantiene la misma politica del listado para consultar un archivo concreto.
  @Permissions(Permission.VIEW_ASSIGNED_PATIENTS)
  @ApiOperation({ summary: 'Obtener un archivo por ID.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: FileResponseDto })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FileResponseDto> {
    return FileMapper.toResponse(await this.service.findById(id));
  }

  /**
   * Actualiza el recurso solicitado.
   * @param id Identificador único del recurso.
   * @param dto Datos necesarios para ejecutar la operación.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Patch(':id')
  // Modificar metadatos se considera parte de la gestion de evidencias.
  @Permissions(Permission.UPLOAD_EVIDENCES)
  @ApiOperation({ summary: 'Actualizar los metadatos de un archivo.' })
  @ApiOkResponse({ type: FileResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFileDto,
  ): Promise<FileResponseDto> {
    return FileMapper.toResponse(await this.service.update(id, dto));
  }

  /**
   * Elimina el recurso solicitado.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  @Delete(':id')
  // La eliminacion queda restringida al administrador para proteger historial
  // clinico y evitar que una evidencia sea retirada por un rol operativo.
  @Roles(SystemRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar el registro de un archivo.' })
  @ApiNoContentResponse()
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }

  /**
   * Crea un archivo con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Post()
  // Crear evidencias requiere el permiso funcional configurado para el rol.
  @Permissions(Permission.UPLOAD_EVIDENCES)
  @ApiOperation({ summary: 'Registrar un archivo.' })
  @ApiCreatedResponse({ type: FileResponseDto })
  async create(@Body() dto: CreateFileDto): Promise<FileResponseDto> {
    return FileMapper.toResponse(await this.service.create(dto));
  }
}
