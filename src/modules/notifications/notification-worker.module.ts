import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { NOTIFICATION_SCHEDULER } from './domain/interfaces/notification-scheduler.repository';
import { PrismaNotificationSchedulerRepository } from './infrastructure/repositories/prisma-notification-scheduler.repository';
import { ScheduleMedicationNotificationsUseCase } from './application/use-cases/schedule-medication-notifications.use-case';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
  providers: [
    ScheduleMedicationNotificationsUseCase,
    {
      provide: NOTIFICATION_SCHEDULER,
      useClass: PrismaNotificationSchedulerRepository,
    },
  ],
})
export class NotificationWorkerModule {}
