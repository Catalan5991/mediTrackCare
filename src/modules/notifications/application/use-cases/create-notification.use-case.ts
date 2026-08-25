import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import {
  INotificationsRepository,
  NOTIFICATIONS_REPOSITORY,
} from '../../domain/interfaces/notifications.repository.interface';

@Injectable()
// Caso de uso responsable de preparar los datos antes de persistir la notificacion.
export class CreateNotificationUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param notificationsRepository Repositorio utilizado para persistir y consultar notifications repository.
   */
  constructor(
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}
  /**
   * Crea un notificacion aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async execute(dto: CreateNotificationDto): Promise<NotificationEntity> {
    // Convierte fechas ISO del transporte a Date para el contrato del repositorio.
    return this.notificationsRepository.create({
      userId: dto.userId,
      patientId: dto.patientId ?? null,
      intakeId: dto.intakeId ?? null,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      status: dto.status,
      sentAt: dto.sentAt ? new Date(dto.sentAt) : null,
      readAt: dto.readAt ? new Date(dto.readAt) : null,
    });
  }
}
