import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//importamos los archivos para Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Valida todos los DTOs antes de ejecutar controladores y casos de uso.
  // whitelist elimina campos sin decoradores; forbidNonWhitelisted rechaza la
  // solicitud en vez de ignorarlos silenciosamente; transform convierte query
  // params y payloads a los tipos declarados por cada DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Ultima frontera de manejo de errores. Convierte excepciones Prisma y errores
  // HTTP en un contrato consistente y evita exponer detalles de infraestructura.
  app.useGlobalFilters(new PrismaExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('MediTrackCare API')
    .setDescription(
      'Documentación de la API para la gestión de pacientes, medicamentos, recetas, mediciones médicas y tomas de medicamentos.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'MediTrackCare API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
