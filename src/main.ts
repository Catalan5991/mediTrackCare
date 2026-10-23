import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//importamos los archivos para Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configureApp } from './configure-app';

/**
 * Inicializa el recurso solicitado.
 * @returns Promesa que resuelve con el resultado de la operación.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

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

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  
}
bootstrap();
