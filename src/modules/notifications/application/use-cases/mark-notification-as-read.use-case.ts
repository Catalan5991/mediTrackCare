import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationInvalidStateException } from '../../domain/exceptions/notification-invalid-state.exception';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import {
  INotificationsRepository,
  NOTIFICATIONS_REPOSITORY,
} from '../../domain/interfaces/notifications.repository.interface';

@Injectable()
// Aplica la transicion de estado a LEIDA respetando reglas del dominio.
export class MarkNotificationAsReadUseCase {
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  async execute(id: number): Promise<NotificationEntity> {
    const notification = await this.notificationsRepository.findById(id);

    if (!notification) {
      throw new NotificationNotFoundException(id);
    }

    // La entidad decide si su estado actual permite marcarla como leida.
    if (!notification.canBeMarkedAsRead()) {
      throw new NotificationInvalidStateException(
        'La notificación no puede marcarse como leída en su estado actual.',
      );
    }

    // Usa la hora del servidor como momento oficial de lectura.
    return this.notificationsRepository.markAsRead(id, new Date());
  }
}
