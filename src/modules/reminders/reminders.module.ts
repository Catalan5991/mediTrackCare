import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { CreateReminderUseCase } from './application/use-cases/create-reminder.use-case';
import { DeleteReminderUseCase } from './application/use-cases/delete-reminder.use-case';
import { FindReminderByIdUseCase } from './application/use-cases/find-reminder-by-id.use-case';
import { FindRemindersUseCase } from './application/use-cases/find-reminders.use-case';
import { UpdateReminderUseCase } from './application/use-cases/update-reminder.use-case';
import { REMINDERS_REPOSITORY } from './domain/interfaces/reminders.repository.interface';
import { RemindersController } from './infrastructure/controllers/reminders.controller';
import { PrismaRemindersRepository } from './infrastructure/repositories/prisma-reminders.repository';
import { RemindersService } from './infrastructure/services/reminders.service';

@Module({
  imports: [PrismaModule],
  controllers: [RemindersController],
  providers: [
    RemindersService,

    CreateReminderUseCase,
    FindRemindersUseCase,
    FindReminderByIdUseCase,
    UpdateReminderUseCase,
    DeleteReminderUseCase,

    {
      provide: REMINDERS_REPOSITORY,
      useClass: PrismaRemindersRepository,
    },
  ],
  exports: [RemindersService],
})
export class RemindersModule {}
