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

@ApiTags('Files')
@Controller('files')
@UseFilters(FileExceptionFilter)
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un archivo.' })
  @ApiCreatedResponse({ type: FileResponseDto })
  async create(@Body() dto: CreateFileDto): Promise<FileResponseDto> {
    return FileMapper.toResponse(await this.service.create(dto));
  }

  @Get()
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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un archivo por ID.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: FileResponseDto })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FileResponseDto> {
    return FileMapper.toResponse(await this.service.findById(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los metadatos de un archivo.' })
  @ApiOkResponse({ type: FileResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFileDto,
  ): Promise<FileResponseDto> {
    return FileMapper.toResponse(await this.service.update(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar el registro de un archivo.' })
  @ApiNoContentResponse()
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
