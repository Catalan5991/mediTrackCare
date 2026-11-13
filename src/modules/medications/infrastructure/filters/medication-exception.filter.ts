import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MedicationNotFoundException } from '../../domain/exceptions/medication-not-found.exception';

// Traduce excepciones de dominio del catalogo a respuestas HTTP consistentes.
@Catch(MedicationNotFoundException)
export class MedicationExceptionFilter implements ExceptionFilter {
  /**
   * Intercepta y traduce el recurso solicitado.
   * @param exception Excepción que debe procesarse.
   * @param host Contexto de argumentos de la excepción.
   * @returns Resultado producido por la operación.
   */
  catch(exception: MedicationNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // El caso de uso no conoce codigos HTTP; el filtro decide la respuesta.
    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
      error: exception.name,
    });
  }
}
