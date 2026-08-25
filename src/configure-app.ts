import { INestApplication, ValidationPipe } from '@nestjs/common';

import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

/** Shared HTTP configuration used by the real server and e2e tests. */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());
}
