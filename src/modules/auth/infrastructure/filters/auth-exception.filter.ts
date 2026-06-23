import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Catch(
  UserAlreadyExistsException,
  InvalidCredentialsException,
  UserNotFoundException,
)
// Traduce errores de dominio de auth a respuestas HTTP consistentes.
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';

    // Cada excepcion de dominio se mapea a su codigo HTTP equivalente.
    if (exception instanceof UserAlreadyExistsException) {
      statusCode = HttpStatus.CONFLICT;
      error = 'Conflict';
    }

    if (exception instanceof InvalidCredentialsException) {
      statusCode = HttpStatus.UNAUTHORIZED;
      error = 'Unauthorized';
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
