import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { DashboardAccessDeniedException } from '../../domain/exceptions/dashboard-access-denied.exception';
import { PatientProfileNotFoundException } from '../../domain/exceptions/patient-profile-not-found.exception';

// Traduce errores de dominio del Dashboard a respuestas HTTP estables, evitando
// filtrar detalles internos de persistencia hacia el cliente.
@Catch(PatientProfileNotFoundException, DashboardAccessDeniedException)
export class DashboardExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof PatientProfileNotFoundException) {
      statusCode = HttpStatus.NOT_FOUND;
    }

    if (exception instanceof DashboardAccessDeniedException) {
      statusCode = HttpStatus.FORBIDDEN;
    }

    return response.status(statusCode).json({
      statusCode,
      error: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
