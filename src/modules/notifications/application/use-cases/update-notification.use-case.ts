import { Inject, Injectable } from '@nestjs/common';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import {
  INotificationsRepository,
  NOTIFICATIONS_REPOSITORY,
} from '../../domain/interfaces/notifications.repository.interface';

@Injectable()
// Valida existencia y prepara los campos de una actualizacion parcial.
export class UpdateNotificationUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param notificationsRepository Repositorio utilizado para persistir y consultar notifications repository.
   */
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}
  /**
   * Actualiza un notificacion aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {NotificationNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(
    id: number,
    dto: UpdateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = await this.notificationsRepository.findById(id);

    // Evita que Prisma lance un error tecnico cuando el registro no existe.
    if (!notification) {
      throw new NotificationNotFoundException(id);
    }

    return this.notificationsRepository.update(id, {
      userId: dto.userId,
      patientId: dto.patientId,
      intakeId: dto.intakeId,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      status: dto.status,
      sentAt: dto.sentAt ? new Date(dto.sentAt) : undefined,
      readAt: dto.readAt ? new Date(dto.readAt) : undefined,
    });
  }
}
