import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-alredy-exists.exception';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Catch(UserAlreadyExistsException, UserNotFoundException)
// Convierte excepciones de dominio de Users en respuestas HTTP previsibles.
export class UsersExceptionFilter implements ExceptionFilter {
  /**
   * Intercepta y traduce el recurso solicitado.
   * @param exception Excepción que debe procesarse.
   * @param host Contexto de argumentos de la excepción.
   * @returns Resultado producido por la operación.
   */
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';

    // Mapeo explicito para que los casos de uso no dependan de codigos HTTP.
    if (exception instanceof UserAlreadyExistsException) {
      statusCode = HttpStatus.CONFLICT;
      error = 'Conflict';
    }

    if (exception instanceof UserNotFoundException) {
      statusCode = HttpStatus.NOT_FOUND;
      error = 'Not Found';
    }

    return response.status(statusCode).json({
      statusCode,
      error,
      message: exception.message,
    });
  }
}
