import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RoleAlreadyExistsException } from '../../domain/exceptions/role-already-exists.exception';
import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

// Traduce excepciones de dominio de Roles a respuestas HTTP consistentes. Asi
// los casos de uso pueden lanzar errores expresivos sin conocer Express ni
// status codes.
@Catch(RoleNotFoundException, RoleAlreadyExistsException)
export class RoleExceptionFilter implements ExceptionFilter {
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

    // Un rol inexistente se informa como recurso no encontrado.
    if (exception instanceof RoleNotFoundException) {
      statusCode = HttpStatus.NOT_FOUND;
    }

    // Un nombre duplicado se informa como conflicto de negocio.
    if (exception instanceof RoleAlreadyExistsException) {
      statusCode = HttpStatus.CONFLICT;
    }

    return response.status(statusCode).json({
      statusCode,
      error: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
