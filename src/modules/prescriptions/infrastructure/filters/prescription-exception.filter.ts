import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrescriptionNotFoundException } from '../../domain/exceptions/prescription-not-found.exception';
import { InvalidPrescriptionException } from '../../domain/exceptions/invalid-prescription.exception';

// Normaliza las excepciones del modulo a una respuesta HTTP consistente.
@Catch(PrescriptionNotFoundException, InvalidPrescriptionException)
export class PrescriptionExceptionFilter implements ExceptionFilter {
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

    response.status(status).json({
      success: false,
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
