import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsController } from './infrastructure/controllers/notifications.controller';
import { NotificationsService } from './infrastructure/services/notifications.service';
import { PrismaNotificationsRepository } from './infrastructure/repositories/prisma-notifications.repository';
import { NOTIFICATIONS_REPOSITORY } from './domain/interfaces/notifications.repository.interface';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { FindAllNotificationsUseCase } from './application/use-cases/find-all-notifications.use-case';
import { FindNotificationByIdUseCase } from './application/use-cases/find-notification-by-id.use-case';
import { UpdateNotificationUseCase } from './application/use-cases/update-notification.use-case';
import { DeleteNotificationUseCase } from './application/use-cases/delete-notification.use-case';
import { MarkNotificationAsReadUseCase } from './application/use-cases/mark-notification-as-read.use-case';
import { MarkNotificationAsSentUseCase } from './application/use-cases/mark-notification-as-sent.use-case';

// Agrupa el controlador, casos de uso y repositorio necesarios para notificaciones.
@Module({
  controllers: [NotificationsController],
  providers: [
    PrismaService,
    NotificationsService,

    CreateNotificationUseCase,
    FindAllNotificationsUseCase,
    FindNotificationByIdUseCase,
    UpdateNotificationUseCase,
    DeleteNotificationUseCase,
    MarkNotificationAsReadUseCase,
    MarkNotificationAsSentUseCase,

    {
      // Vincula el contrato del dominio con la implementacion persistente en Prisma.
      provide: NOTIFICATIONS_REPOSITORY,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
