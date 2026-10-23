import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { Request, Response } from 'express';

// Filtro global que establece una frontera entre los errores internos de la
// aplicacion y el contrato HTTP. Su objetivo principal es impedir que los
// detalles tecnicos de Prisma (consulta, tabla, restricciones o stack trace)
// lleguen al cliente y convertir los fallos conocidos en respuestas 4xx utiles.
// Los errores realmente inesperados conservan el estado 500, pero se devuelven
// con un mensaje seguro y se registran en el servidor para su diagnostico.
@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  // Logger de Nest utilizado solamente para errores no controlados. Los errores
  // esperados del cliente (400, 404 o 409) no se registran como fallos internos.
  private readonly logger = new Logger(PrismaExceptionFilter.name);
  /**
   * Ejecuta la operación to http exception.
   * @param exception Excepción que debe procesarse.
   * @returns Resultado producido por la operación.
   */
  private toHttpException(exception: unknown): HttpException {
    // Respeta excepciones HTTP creadas de forma intencional por guards, pipes,
    // controladores o casos de uso: BadRequest, Unauthorized, Forbidden, etc.
    if (exception instanceof HttpException) return exception;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Los codigos conocidos de Prisma se traducen a semantica HTTP sin exponer
      // metadata de base de datos. Esto tambien cubre condiciones de carrera,
      // por ejemplo cuando un registro desaparece despues de validar existencia.
      switch (exception.code) {
        case 'P2034':
          return new ConflictException(
            'El recurso cambio durante la operacion; vuelve a consultar e intenta de nuevo.',
          );
        case 'P2021':
        case 'P2022':
          return new InternalServerErrorException(
            'El esquema de base de datos requiere actualizar sus migraciones.',
          );
        case 'P2002':
          // Restriccion unique: el recurso solicitado duplicaria datos unicos.
          return new ConflictException(
            'Ya existe un registro con los mismos datos únicos.',
          );
        case 'P2003':
        case 'P2014':
          // Llaves foraneas o relaciones obligatorias impiden la operacion.
          return new ConflictException(
            'La operación viola una relación existente.',
          );
        case 'P2025':
          // Prisma no encontro el registro requerido por update/delete.
          return new NotFoundException('El registro solicitado no existe.');
        case 'P2000':
        case 'P2005':
        case 'P2006':
        case 'P2007':
        case 'P2011':
        case 'P2012':
        case 'P2013':
          // Datos incompatibles con el schema o campos obligatorios ausentes.
          return new BadRequestException(
            'Los datos enviados no son válidos para esta operación.',
          );
        default:
          // Otros errores conocidos son atribuibles a la operacion solicitada,
          // pero se usa un mensaje generico para no revelar detalles internos.
          return new BadRequestException(
            'No fue posible completar la operación solicitada.',
          );
      }
    }

    // Prisma lanza esta clase antes de consultar la base cuando la estructura de
    // una operacion no coincide con el cliente generado.
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return new BadRequestException(
        'La consulta contiene datos o campos no válidos.',
      );
    }

    // Los errores desconocidos no deben disfrazarse como errores del cliente.
    // Se conserva 500, con respuesta segura, y catch() registra el detalle real.
    return new InternalServerErrorException(
      'Ocurrió un error interno inesperado.',
    );
  }
  /**
   * Ejecuta la operación read field.
   * @param body Valor de body requerido por la operacion.
   * @param field Valor de field requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  private readField(
    body: string | object,
    field: 'error' | 'message',
  ): unknown {
    // HttpException puede contener texto simple o un objeto. Este helper extrae
    // campos solo cuando existen y permite mantener una respuesta uniforme.
    return typeof body === 'object' && body !== null && field in body
      ? (body as Record<string, unknown>)[field]
      : undefined;
  }

  /**
   * Intercepta y traduce el recurso solicitado.
   * @param exception Excepción que debe procesarse.
   * @param host Contexto de argumentos de la excepción.
   * @returns No retorna ningún valor.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    // Cambia del contexto generico de Nest al contexto HTTP para obtener la
    // solicitud original y construir manualmente la respuesta normalizada.
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const httpException = this.toHttpException(exception);
    const status = httpException.getStatus();
    const body = httpException.getResponse();

    // Un 5xx debe quedar registrado con ruta y stack trace. El stack nunca se
    // incluye en el JSON de respuesta, evitando filtrar informacion sensible.
    if (status >= 500) {
      this.logger.error(
        `Error no controlado en ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    // Todos los errores globales comparten esta estructura. Los filtros
    // especificos de cada modulo pueden seguir manejando excepciones de dominio.
    response.status(status).json({
      statusCode: status,
      error: this.readField(body, 'error') ?? httpException.name,
      message: this.readField(body, 'message') ?? String(body),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
