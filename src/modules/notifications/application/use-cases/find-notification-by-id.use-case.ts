import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import {
  INotificationsRepository,
  NOTIFICATIONS_REPOSITORY,
} from '../../domain/interfaces/notifications.repository.interface';

@Injectable()
// Centraliza la busqueda individual y el manejo de recurso inexistente.
export class FindNotificationByIdUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param notificationsRepository Repositorio utilizado para persistir y consultar notifications repository.
   */
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}
  /**
   * Obtiene informacion de notificacion segun los criterios indicados.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {NotificationNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<NotificationEntity> {
    const notification = await this.notificationsRepository.findById(id);

    // Mantiene el mismo error de negocio para todos los endpoints por ID.
    if (!notification) {
      throw new NotificationNotFoundException(id);
    }

    return notification;
  }
}
