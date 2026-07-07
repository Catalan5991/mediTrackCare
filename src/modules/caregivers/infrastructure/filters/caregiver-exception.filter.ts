import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CaregiverAlreadyExistsException } from '../../domain/exceptions/caregiver-already-exists.exception';
import { CaregiverNotFoundException } from '../../domain/exceptions/caregiver-not-found.exception';

// Traduce excepciones de dominio de Caregivers a respuestas HTTP consistentes.
// Asi los casos de uso pueden lanzar errores expresivos sin conocer Express,
// status codes ni el formato final de la respuesta.
@Catch(CaregiverNotFoundException, CaregiverAlreadyExistsException)
export class CaregiverExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    // Una relacion inexistente se informa como recurso no encontrado.
    if (exception instanceof CaregiverNotFoundException) {
      statusCode = HttpStatus.NOT_FOUND;
    }

    // Un duplicado userId-patientId se informa como conflicto de negocio.
    if (exception instanceof CaregiverAlreadyExistsException) {
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
