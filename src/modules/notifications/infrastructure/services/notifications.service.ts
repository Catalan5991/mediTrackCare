import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../../application/dtos/create-notification.dto';
import { UpdateNotificationDto } from '../../application/dtos/update-notification.dto';
import { QueryNotificationsDto } from '../../application/dtos/query-notifications.dto';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PaginatedNotifications } from '../../domain/interfaces/notifications.repository.interface';
import { CreateNotificationUseCase } from '../../application/use-cases/create-notification.use-case';
import { FindAllNotificationsUseCase } from '../../application/use-cases/find-all-notifications.use-case';
import { FindNotificationByIdUseCase } from '../../application/use-cases/find-notification-by-id.use-case';
import { UpdateNotificationUseCase } from '../../application/use-cases/update-notification.use-case';
import { DeleteNotificationUseCase } from '../../application/use-cases/delete-notification.use-case';
import { MarkNotificationAsReadUseCase } from '../../application/use-cases/mark-notification-as-read.use-case';
import { MarkNotificationAsSentUseCase } from '../../application/use-cases/mark-notification-as-sent.use-case';

@Injectable()
// Fachada que expone operaciones del modulo sin acoplar el controller a casos de uso.
export class NotificationsService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createNotificationUseCase Caso de uso encargado de create notification use case.
   * @param findAllNotificationsUseCase Caso de uso encargado de find all notifications use case.
   * @param findNotificationByIdUseCase Caso de uso encargado de find notification by id use case.
   * @param updateNotificationUseCase Caso de uso encargado de update notification use case.
   * @param deleteNotificationUseCase Caso de uso encargado de delete notification use case.
   * @param markNotificationAsReadUseCase Caso de uso encargado de mark notification as read use case.
   * @param markNotificationAsSentUseCase Caso de uso encargado de mark notification as sent use case.
   */
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly findAllNotificationsUseCase: FindAllNotificationsUseCase,
    private readonly findNotificationByIdUseCase: FindNotificationByIdUseCase,
    private readonly updateNotificationUseCase: UpdateNotificationUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markNotificationAsSentUseCase: MarkNotificationAsSentUseCase,
  ) {}
  /**
   * Crea un notificacion con los datos recibidos.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  create(dto: CreateNotificationDto): Promise<NotificationEntity> {
    // Cada metodo delega una intencion de la API en su caso de uso especifico.
    return this.createNotificationUseCase.execute(dto);
  }
  /**
   * Obtiene el listado de notificacions que cumplen los filtros indicados.
   * @param query Datos de query validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  findAll(query: QueryNotificationsDto): Promise<PaginatedNotifications> {
    return this.findAllNotificationsUseCase.execute(query);
  }
  /**
   * Obtiene un notificacion por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  findById(id: number): Promise<NotificationEntity> {
    return this.findNotificationByIdUseCase.execute(id);
  }
  /**
   * Actualiza un notificacion existente.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  update(id: number, dto: UpdateNotificationDto): Promise<NotificationEntity> {
    return this.updateNotificationUseCase.execute(id, dto);
  }
  /**
   * Ejecuta la operación mark as read.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  markAsRead(id: number): Promise<NotificationEntity> {
    return this.markNotificationAsReadUseCase.execute(id);
  }
  /**
   * Ejecuta la operación mark as sent.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  markAsSent(id: number): Promise<NotificationEntity> {
    return this.markNotificationAsSentUseCase.execute(id);
  }

  /**
   * Elimina un notificacion por su identificador.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  delete(id: number): Promise<void> {
    return this.deleteNotificationUseCase.execute(id);
  }
}
