import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PatientNotFoundException } from '../../domain/exceptions/patient-not-found.exception';
import { PatientAlreadyExistsException } from '../../domain/exceptions/patient-already-exists.exception';

// Traduce excepciones de dominio de Patients a respuestas HTTP consistentes.
@Catch(PatientNotFoundException, PatientAlreadyExistsException)
export class PatientExceptionFilter implements ExceptionFilter {
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

    // Cada excepcion de dominio se mapea a su codigo HTTP equivalente.
    if (exception instanceof PatientNotFoundException) {
      statusCode = HttpStatus.NOT_FOUND;
    }

    if (exception instanceof PatientAlreadyExistsException) {
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
