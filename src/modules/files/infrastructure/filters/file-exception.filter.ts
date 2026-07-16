import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileNotFoundException } from '../../domain/exceptions/file-not-found.exception';
import { FileRelationNotFoundException } from '../../domain/exceptions/file-relation-not-found.exception';

@Catch(FileNotFoundException, FileRelationNotFoundException)
export class FileExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<{ url: string }>();
    const body = exception.getResponse();
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      error:
        typeof body === 'string'
          ? exception.name
          : (body as { error?: string }).error,
      message:
        typeof body === 'string' ? body : (body as { message: string }).message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
