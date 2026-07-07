import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
// Normaliza las excepciones HTTP del modulo con path y timestamp.
export class IntakesExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Conserva el cuerpo original de Nest cuando incluye detalles de validacion.
    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      error:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse,
    });
  }
}
