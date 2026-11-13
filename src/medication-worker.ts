import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NotificationWorkerModule } from './modules/notifications/notification-worker.module';
import { ScheduleMedicationNotificationsUseCase } from './modules/notifications/application/use-cases/schedule-medication-notifications.use-case';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    NotificationWorkerModule,
  );
  const scheduler = app.get(ScheduleMedicationNotificationsUseCase),
    logger = new Logger('MedicationWorker');
  let stopped = false;
  const stop = () => {
    stopped = true;
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  try {
    while (!stopped) {
      try {
        await scheduler.execute();
      } catch (error) {
        logger.error(
          'Fallo la programacion de medicamentos.',
          error instanceof Error ? error.stack : undefined,
        );
      }
      if (!stopped)
        await new Promise<void>((resolve) => {
          const timer = setTimeout(done, 60000);
          function done() {
            clearTimeout(timer);
            process.removeListener('SIGINT', done);
            process.removeListener('SIGTERM', done);
            resolve();
          }
          process.once('SIGINT', done);
          process.once('SIGTERM', done);
        });
    }
  } finally {
    await app.close();
  }
}
void bootstrap();
