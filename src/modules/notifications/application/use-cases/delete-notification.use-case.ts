import { Inject, Injectable } from '@nestjs/common';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import {
  INotificationsRepository,
  NOTIFICATIONS_REPOSITORY,
} from '../../domain/interfaces/notifications.repository.interface';

@Injectable()
// Elimina una notificacion solo despues de confirmar que existe.
export class DeleteNotificationUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param notificationsRepository Repositorio utilizado para persistir y consultar notifications repository.
   */
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}
  /**
   * Elimina un notificacion aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   * @throws {NotificationNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<void> {
    const notification = await this.notificationsRepository.findById(id);

    // La validacion previa permite responder con la excepcion del dominio.
    if (!notification) {
      throw new NotificationNotFoundException(id);
    }

    await this.notificationsRepository.delete(id);
  }
}
