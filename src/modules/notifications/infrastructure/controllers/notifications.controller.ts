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
  ForbiddenException,
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
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { CurrentUser as AuthenticatedUser } from '../../../../common/decorators/current-user.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { SystemRole } from '../../../../common/enums/system-role.enum';

@ApiTags('Notifications')
@Controller('notifications')
@UseFilters(NotificationExceptionFilter)
// Expone endpoints HTTP y transforma entidades del dominio a DTOs de respuesta.
export class NotificationsController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param notificationsService Servicio que coordina las operaciones de notifications service.
   */
  constructor(private readonly notificationsService: NotificationsService) {}
  /**
   * Obtiene el listado de notificacions que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @param user Valor de user requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener notificaciones con filtros y paginación.' })
  @ApiOkResponse({ type: PaginatedNotificationsResponseDto })
  async findAll(
    @Query() query: QueryNotificationsDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PaginatedNotificationsResponseDto> {
    // Un usuario operativo no puede ampliar el alcance manipulando userId en la
    // query. El servidor fuerza su propio id; ADMIN conserva filtros globales.
    if (user.role.toUpperCase() !== SystemRole.ADMIN) query.userId = user.id;
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
  /**
   * Obtiene un notificacion por su identificador.
   * @param id Identificador único del recurso.
   * @param user Valor de user requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: NotificationResponseDto })
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.findById(id);
    // La autorizacion por rol permite entrar a la ruta; esta segunda validacion
    // aplica autorizacion por propiedad sobre el registro concreto.
    this.assertOwnerOrAdmin(notification.userId, user);
    return NotificationMapper.toResponse(notification);
  }
  /**
   * Ejecuta la operación mark as read.
   * @param id Identificador único del recurso.
   * @param user Valor de user requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: NotificationResponseDto })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<NotificationResponseDto> {
    // Se obtiene primero el recurso para responder 404 si no existe y comprobar
    // propiedad antes de ejecutar la transicion de estado.
    const current = await this.notificationsService.findById(id);
    this.assertOwnerOrAdmin(current.userId, user);
    // Ruta especializada para una transicion de estado controlada.
    const notification = await this.notificationsService.markAsRead(id);
    return NotificationMapper.toResponse(notification);
  }
  /**
   * Ejecuta la operación mark as sent.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Patch(':id/sent')
  // El envio es una accion del sistema/administrador, no del destinatario.
  @Roles(SystemRole.ADMIN)
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
  /**
   * Ejecuta la operación assert owner or admin.
   * @param userId Valor de user id requerido por la operacion.
   * @param user Valor de user requerido por la operacion.
   * @returns No retorna ningún valor.
   * @throws {ForbiddenException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  private assertOwnerOrAdmin(userId: number, user: AuthenticatedUser): void {
    // ADMIN puede operar sobre cualquier destinatario. Los demas roles solo
    // pueden acceder cuando el userId persistido coincide con el JWT validado.
    if (user.role.toUpperCase() !== SystemRole.ADMIN && user.id !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a esta notificación.',
      );
    }
  }

  /**
   * Crea un notificacion con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Post()
  // Solo administracion puede emitir notificaciones para otros usuarios.
  @Roles(SystemRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva notificación.' })
  @ApiCreatedResponse({ type: NotificationResponseDto })
  async create(
    @Body() dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationsService.create(dto);
    // El mapper evita exponer directamente la entidad interna.
    return NotificationMapper.toResponse(notification);
  }

  /**
   * Actualiza un notificacion existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  @Patch(':id')
  // La edicion general puede cambiar destinatario, contenido y estado, por lo
  // que se reserva al administrador.
  @Roles(SystemRole.ADMIN)
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

  /**
   * Elimina un notificacion por su identificador.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  @Delete(':id')
  // Restringe la eliminacion para conservar el historial del destinatario.
  @Roles(SystemRole.ADMIN)
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
