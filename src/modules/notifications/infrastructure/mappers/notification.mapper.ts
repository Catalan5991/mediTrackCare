import { Notification, Prisma } from '../../../../../generated/prisma/client';
import {
  CreateNotificationData,
  UpdateNotificationData,
} from '../../domain/interfaces/notifications.repository.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationResponseDto } from '../../application/dtos/notification-response.dto';

// Aisla las conversiones entre Prisma, dominio y respuestas HTTP.
export class NotificationMapper {
  static toEntity(notification: Notification): NotificationEntity {
    // La entidad recibe valores ya persistidos y concentra reglas de estado.
    return new NotificationEntity(
      notification.id,
      notification.userId,
      notification.patientId,
      notification.intakeId,
      notification.title,
      notification.message,
      notification.type,
      notification.status,
      notification.sentAt,
      notification.readAt,
      notification.createdAt,
    );
  }

  static toPrismaCreate(
    data: CreateNotificationData,
  ): Prisma.NotificationUncheckedCreateInput {
    // Normaliza relaciones opcionales como null para la base de datos.
    return {
      userId: data.userId,
      patientId: data.patientId ?? null,
      intakeId: data.intakeId ?? null,
      title: data.title,
      message: data.message,
      type: data.type,
      status: data.status,
      sentAt: data.sentAt ?? null,
      readAt: data.readAt ?? null,
    };
  }

  static toPrismaUpdate(
    data: UpdateNotificationData,
  ): Prisma.NotificationUncheckedUpdateInput {
    const updateData: Prisma.NotificationUncheckedUpdateInput = {};

    // Solo se envian campos definidos para evitar sobrescrituras accidentales.
    if (data.userId !== undefined) updateData.userId = data.userId;
    if (data.patientId !== undefined) updateData.patientId = data.patientId;
    if (data.intakeId !== undefined) updateData.intakeId = data.intakeId;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.message !== undefined) updateData.message = data.message;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.sentAt !== undefined) updateData.sentAt = data.sentAt;
    if (data.readAt !== undefined) updateData.readAt = data.readAt;

    return updateData;
  }

  static toResponse(entity: NotificationEntity): NotificationResponseDto {
    // Define explicitamente el contrato que consume el cliente.
    return {
      id: entity.id,
      userId: entity.userId,
      patientId: entity.patientId,
      intakeId: entity.intakeId,
      title: entity.title,
      message: entity.message,
      type: entity.type,
      status: entity.status,
      sentAt: entity.sentAt,
      readAt: entity.readAt,
      createdAt: entity.createdAt,
    };
  }
}
