import { Inject, Injectable } from '@nestjs/common';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import {
  INotificationsRepository,
  NOTIFICATIONS_REPOSITORY,
} from '../../domain/interfaces/notifications.repository.interface';

@Injectable()
// Elimina una notificacion solo despues de confirmar que existe.
export class DeleteNotificationUseCase {
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const notification = await this.notificationsRepository.findById(id);

    // La validacion previa permite responder con la excepcion del dominio.
    if (!notification) {
      throw new NotificationNotFoundException(id);
    }

    await this.notificationsRepository.delete(id);
  }
}
