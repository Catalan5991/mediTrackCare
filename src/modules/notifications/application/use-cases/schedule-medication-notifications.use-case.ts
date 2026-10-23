import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_SCHEDULER } from '../../domain/interfaces/notification-scheduler.repository';
import type { NotificationSchedulerRepository } from '../../domain/interfaces/notification-scheduler.repository';
@Injectable()
export class ScheduleMedicationNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_SCHEDULER)
    private readonly repository: NotificationSchedulerRepository,
  ) {}
  execute() {
    return this.repository.schedule();
  }
}
