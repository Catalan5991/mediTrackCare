export const NOTIFICATION_SCHEDULER = 'NOTIFICATION_SCHEDULER';
export interface NotificationSchedulerRepository {
  schedule(): Promise<void>;
}
