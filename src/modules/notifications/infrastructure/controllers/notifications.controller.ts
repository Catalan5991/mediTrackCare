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
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto } from '../../application/dtos/create-notification.dto';
import { UpdateNotificationDto } from '../../application/dtos/update-notification.dto';
import { QueryNotificationsDto } from '../../application/dtos/query-notifications.dto';
import {
  NotificationResponseDto,
  PaginatedNotificationsResponseDto,
} from '../../application/dtos/notification-response.dto';
import { NotificationMapper } from '../mappers/notification.mapper';
import { NotificationExceptionFilter } from '../filters/notification-exception.filter';

@ApiTags('Notifications')
@Controller('notifications')
@UseFilters(NotificationExceptionFilter)
// Expone endpoints HTTP y transforma entidades del dominio a DTOs de respuesta.
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación.' })
  @ApiCreatedResponse({ type: NotificationResponseDto })
  async create(
    @Body() dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.create(dto);
    // El mapper evita exponer directamente la entidad interna.
    return NotificationMapper.toResponse(notification);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener notificaciones con filtros y paginación.' })
  @ApiOkResponse({ type: PaginatedNotificationsResponseDto })
  async findAll(
    @Query() query: QueryNotificationsDto,
  ): Promise<PaginatedNotificationsResponseDto> {
    const result = await this.notificationsService.findAll(query);

    // Conserva la metadata de paginacion y mapea cada registro al contrato publico.
    return {
      data: result.data.map(NotificationMapper.toResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: NotificationResponseDto })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.findById(id);
    return NotificationMapper.toResponse(notification);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una notificación.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: NotificationResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.update(id, dto);
    return NotificationMapper.toResponse(notification);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: NotificationResponseDto })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationResponseDto> {
    // Ruta especializada para una transicion de estado controlada.
    const notification = await this.notificationsService.markAsRead(id);
    return NotificationMapper.toResponse(notification);
  }

  @Patch(':id/sent')
  @ApiOperation({ summary: 'Marcar una notificación como enviada.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: NotificationResponseDto })
  async markAsSent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationResponseDto> {
    // Ruta especializada para registrar el envio de la notificacion.
    const notification = await this.notificationsService.markAsSent(id);
    return NotificationMapper.toResponse(notification);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una notificación.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNoContentResponse({
    description: 'Notificación eliminada correctamente.',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.notificationsService.delete(id);
  }
}
