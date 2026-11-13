import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import { NotificationInvalidStateException } from '../../domain/exceptions/notification-invalid-state.exception';

@Catch(NotificationNotFoundException, NotificationInvalidStateException)
// Da formato uniforme a las excepciones de dominio propias de notificaciones.
export class NotificationExceptionFilter implements ExceptionFilter {
  /**
   * Intercepta y traduce el recurso solicitado.
   * @param exception Excepción que debe procesarse.
   * @param host Contexto de argumentos de la excepción.
   * @returns No retorna ningún valor.
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    // Soporta respuestas simples y objetos generados por HttpException.
    response.status(status).json({
      statusCode: status,
      error:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).error,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
