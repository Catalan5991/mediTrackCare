import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { DoctorAlreadyExistsException } from '../../domain/exceptions/doctor-already-exists.exception';
import { DoctorNotFoundException } from '../../domain/exceptions/doctor-not-found.exception';
import { DoctorInactiveException } from '../../domain/exceptions/doctor-inactive.exception';
import { InvalidDoctorUserException } from '../../domain/exceptions/invalid-doctor-user.exception';

@Catch(
  DoctorNotFoundException,
  DoctorAlreadyExistsException,
  DoctorInactiveException,
  InvalidDoctorUserException,
)
export class DoctorExceptionFilter implements ExceptionFilter {
  /**
   * Intercepta y traduce el recurso solicitado.
   * @param exception Excepción que debe procesarse.
   * @param host Contexto de argumentos de la excepción.
   * @returns No retorna ningún valor.
   */
  catch(exception: Error, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const statusCode =
      exception instanceof DoctorNotFoundException
        ? HttpStatus.NOT_FOUND
        : exception instanceof InvalidDoctorUserException
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.CONFLICT;
    response.status(statusCode).json({
      statusCode,
      error: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
