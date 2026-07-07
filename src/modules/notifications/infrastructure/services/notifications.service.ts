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
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly findAllNotificationsUseCase: FindAllNotificationsUseCase,
    private readonly findNotificationByIdUseCase: FindNotificationByIdUseCase,
    private readonly updateNotificationUseCase: UpdateNotificationUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markNotificationAsSentUseCase: MarkNotificationAsSentUseCase,
  ) {}

  create(dto: CreateNotificationDto): Promise<NotificationEntity> {
    // Cada metodo delega una intencion de la API en su caso de uso especifico.
    return this.createNotificationUseCase.execute(dto);
  }

  findAll(query: QueryNotificationsDto): Promise<PaginatedNotifications> {
    return this.findAllNotificationsUseCase.execute(query);
  }

  findById(id: number): Promise<NotificationEntity> {
    return this.findNotificationByIdUseCase.execute(id);
  }

  update(
    id: number,
    dto: UpdateNotificationDto,
  ): Promise<NotificationEntity> {
    return this.updateNotificationUseCase.execute(id, dto);
  }

  delete(id: number): Promise<void> {
    return this.deleteNotificationUseCase.execute(id);
  }

  markAsRead(id: number): Promise<NotificationEntity> {
    return this.markNotificationAsReadUseCase.execute(id);
  }

  markAsSent(id: number): Promise<NotificationEntity> {
    return this.markNotificationAsSentUseCase.execute(id);
  }
}
